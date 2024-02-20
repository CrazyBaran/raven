import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import {
  KanbanBoard,
  KanbanColumn,
  KanbanFooterGroup,
  KanbanGroup,
  OpportunityCard,
} from '@app/client/opportunities/ui';
import { OpportunityUtils } from '@app/client/opportunities/utils';
import {
  pipelinesQuery,
  selectAllPipelineStages,
} from '@app/client/pipelines/state';
import {
  ButtongroupNavigationModel,
  DropdownNavigationModel,
} from '@app/client/shared/ui-router';
import {
  buildButtonGroupNavigation,
  buildDropdownNavigation,
  buildInputNavigation,
  buildPageParamsSelector,
} from '@app/client/shared/util-router';
import { tagsFeature, tagsQuery } from '@app/client/tags/state';
import { OpportunityData } from '@app/rvns-opportunities';
import { PipelineStageData } from '@app/rvns-pipelines';
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

const pipelineBoardQueryParams = [
  'member',
  'round',
  'query',
  'take',
  'skip',
] as const;

export const selectPipelineBoardParams = buildPageParamsSelector(
  pipelineBoardQueryParams,
  {
    skip: '0',
    take: '500',
  },
);

export const selectPipelineBoardButtonGroupNavigation = createSelector(
  selectPipelineBoardParams,
  tagsQuery.selectCurrentUserTag,
  (params, userTag): ButtongroupNavigationModel =>
    buildButtonGroupNavigation({
      params,
      name: 'member',
      buttons: [
        {
          id: null,
          name: 'All deals',
        },
        {
          id: userTag?.userId ?? 'unknown',
          name: 'My deals',
        },
      ],
    }),
);

export const selectPipelineBoardNavigationDropdowns = createSelector(
  selectPipelineBoardParams,
  tagsFeature.selectOpportunityTags,
  tagsFeature.selectPeopleTags,
  tagsFeature.selectLoadingTags,
  (
    params,
    opportunityTags,
    peopleTags,
    loadingTags,
  ): DropdownNavigationModel[] => {
    const opportunityData = opportunityTags.map((t) => ({
      name: t.name,
      id: t.name,
    }));

    const peopleData = peopleTags.map((t) => ({
      name: t.name,
      id: t.userId,
    }));

    return [
      buildDropdownNavigation({
        params,
        name: 'round',
        data: opportunityData,
        defaultItem: {
          id: null,
          name: 'All funding Rounds',
        },
        loading: loadingTags.opportunity,
      }),

      buildDropdownNavigation({
        params,
        name: 'member',
        data: peopleData,
        defaultItem: {
          id: null,
          name: 'Deal Lead',
        },
        loading: loadingTags.people,
      }),
    ];
  },
);

export const selectPipelineBoardQueryModel = createSelector(
  selectPipelineBoardParams,
  (params) =>
    buildInputNavigation({
      params,
      name: 'query',
      placeholder: 'Search Pipeline',
    }),
);

export const selectIsLoadingPipelineBoard = createSelector(
  pipelinesQuery.selectIsLoading,
  opportunitiesQuery.selectIsLoading,
  // opportunitiesQuery.selectIsLoadingUpdateStage,
  (pipelines, opportunities) => pipelines || opportunities,
);

export const selectOportunitiesStageDictionary = createSelector(
  opportunitiesQuery.selectAllOpportunities,
  (opportunities) =>
    _.chain(opportunities)
      .groupBy((o) => o.stage.id)
      .value(),
);

export const selectPipelinesPageViewModel = createSelector(
  selectIsLoadingPipelineBoard,
  selectPipelineBoardNavigationDropdowns,
  selectPipelineBoardButtonGroupNavigation,
  selectPipelineBoardQueryModel,
  (isLoading, dropdowns, buttonGroups, queryModel) => ({
    isLoading,
    dropdowns,
    buttonGroups,
    queryModel,
  }),
);

function createCard(
  opportunity: OpportunityData,
  stage: PipelineStageData,
): OpportunityCard {
  return {
    id: opportunity.id,
    organisation: {
      name: opportunity.organisation.name,
      domains: opportunity.organisation.domains,
      id: opportunity.organisation!.id!,
    },
    createdAt: opportunity.createdAt!.toString(),
    updatedAt: opportunity.updatedAt!.toString(),
    dealLeads: opportunity.team?.owners.map((owner) => owner.actorName) ?? [],
    affinityUrl: opportunity.organisation.affinityUrl,
    additionalFields:
      stage.showFields?.map(({ fieldName, displayName }) => ({
        label: displayName,
        value: _.get(opportunity, fieldName),
      })) ?? [],
    created: !!opportunity.tag,
    showOpenDetailsButton: !!opportunity.tag,
  };
}

function toKanbanFooterGroup(stage: PipelineStageData): KanbanFooterGroup {
  const isWon = OpportunityUtils.isWonStage(stage);
  return {
    name: stage.displayName,
    id: stage.id,
    theme: stage.configuration!.color as 'warning' | 'success',
    droppableFrom: stage.configuration!.droppableFrom ?? [],
    //todo: implement when api ready
    removeSwitch: !isWon,
    reminder: !isWon,
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectKanbanBoard = (groupingEnabled: boolean) =>
  createSelector(
    selectAllPipelineStages,
    selectOportunitiesStageDictionary,
    (stages, opportunitiesStageDictionary): KanbanBoard => {
      const footers: KanbanFooterGroup[] = _.chain(stages)
        .filter(({ configuration }) => !!configuration)
        .orderBy('configuration.order')
        .map(toKanbanFooterGroup)
        .value();

      const columns = _.chain(stages)
        .filter(({ configuration, isHidden }) => !configuration && !isHidden)
        .orderBy('order')
        .map((stage) => ({
          ...stage,
          prefix: groupingEnabled
            ? stage.displayName.split(' - ')[0]
            : stage.displayName,
          displayName: groupingEnabled
            ? stage.displayName.split(' - ')[1] ?? stage.displayName
            : stage.displayName,
        }))
        .groupBy('prefix')
        .mapValues(
          (stages): KanbanColumn => ({
            name: stages[0].prefix,
            backgroundColor: stages[0].secondaryColor ?? stages[0].primaryColor,
            color: stages[0].primaryColor,
            groups: stages.map(
              (stage): KanbanGroup => ({
                id: stage.id,
                name: stage.displayName,
                cards:
                  opportunitiesStageDictionary[stage.id]?.map((opportunity) =>
                    createCard(opportunity, stage),
                  ) ?? [],
                length: opportunitiesStageDictionary[stage.id]?.length ?? 0,
              }),
            ),
          }),
        )
        .values()
        .value();

      return {
        columns,
        footers: groupingEnabled ? footers : [],
        preliminiaryColumn: columns!.find(
          ({ name }) => name.toLowerCase().includes('preliminary dd')!,
        )!,
      };
    },
  );
