import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import {
  calculateOpportunityCardHeight,
  KanbanBoard,
  KanbanColumn,
  KanbanGroup,
  OpportunityCard,
} from '@app/client/opportunities/ui';
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
export const selectOpportunitiesCardsDictionary = createSelector(
  opportunitiesQuery.selectAllOpportunities,
  (opportunities) =>
    _.chain(opportunities)
      .map(
        (o): OpportunityCard => ({
          id: o.id,
          organisation: {
            name: o.organisation.name,
            domains: o.organisation.domains,
            id: o.organisation!.id!,
          },
          name: o.tag?.name,
          createdAt: o.createdAt!.toString(),
          dealLeads: o.team?.owners.map((owner) => owner.actorName) ?? [],
          affinityUrl: o.organisation.affinityUrl,
          timing: o.timing,
        }),
      )
      .map((card) => ({
        ...card,
        height: calculateOpportunityCardHeight(card),
      }))
      .keyBy((o) => o.id)
      .value(),
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
      .mapValues((opportunities) => opportunities.map(({ id }) => id))
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectKanbanBoard = (groupingEnabled: boolean) =>
  createSelector(
    selectAllPipelineStages,
    selectOportunitiesStageDictionary,
    selectOpportunitiesCardsDictionary,
    (
      stages,
      opportunitiesStageDictionary,
      opportunityCardsDictionary,
    ): KanbanBoard => {
      const columns = _.chain(stages)
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
                  opportunitiesStageDictionary[stage.id]?.map(
                    (id) => opportunityCardsDictionary[id]!,
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
      footers: [
        {
          name: 'Pass',
          id: 'pass',
          theme: 'warning',
          reminder: true,
          removeSwitch: true,
        },
        {
          name: 'Lost',
          id: 'lost',
          theme: 'warning',
          reminder: true,
          removeSwitch: true,
        },
        {
          name: 'Won',
          id: 'won',
          theme: 'success',
          reminder: false,
          removeSwitch: false,
        },
      ],
    };
  },
);
