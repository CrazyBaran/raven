import { authQuery } from '@app/client/core/auth';
import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import { OpportunityDetails } from '@app/client/opportunities/ui';
import {
  pipelinesQuery,
  selectAllPipelines,
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
import { getRouterSelectors } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

const pipelineBoardQueryParams = ['member', 'round', 'query'] as const;

export const selectPipelineBoardParams = buildPageParamsSelector(
  pipelineBoardQueryParams,
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
      placeholder: 'Search Companies',
    }),
);
export const selectAllOpportunitiesDictionary = createSelector(
  opportunitiesQuery.selectAllOpportunities,
  (opportunities) =>
    _.chain(opportunities)
      .map(
        (o): OpportunityDetails => ({
          id: o.id,
          fields: o.fields,
          organisation: o.organisation,
        }),
      )
      .keyBy((o) => o.id)
      .value(),
);

export const selectIsLoadingPipelineBoard = createSelector(
  pipelinesQuery.selectIsLoading,
  opportunitiesQuery.selectIsLoading,
  (pipelines, opportunities) => pipelines || opportunities,
);

export const selectOportunitiesStageDictionary = createSelector(
  opportunitiesQuery.selectAllOpportunities,
  getRouterSelectors().selectQueryParam('filter'),
  authQuery.selectUserEmail,
  getRouterSelectors().selectQueryParam('pipelineQuery'),
  (opportunities, filter, userEmail, searchQuery) =>
    _.chain(opportunities)
      .groupBy((o) => o.stage.id)
      .mapValues((opportunities) => opportunities.map(({ id }) => id))
      .value(),
);

export const selectPipelinesPageViewModel = createSelector(
  selectAllOpportunitiesDictionary,
  selectOportunitiesStageDictionary,
  selectAllPipelines,
  selectIsLoadingPipelineBoard,
  selectPipelineBoardNavigationDropdowns,
  selectPipelineBoardButtonGroupNavigation,
  selectPipelineBoardQueryModel,
  (
    opportunitiesDictionary,
    opportunitiesStageDictionary,
    pipelines,
    isLoading,
    dropdowns,
    buttonGroups,
    queryModel,
  ) => ({
    opportunitiesDictionary,
    opportunitiesStageDictionary,
    pipelines,
    isLoading,
    dropdowns,
    buttonGroups,
    queryModel,
  }),
);
