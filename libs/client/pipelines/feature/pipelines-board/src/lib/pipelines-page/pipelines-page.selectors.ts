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
import { routerQuery } from '@app/client/shared/util-router';
import { getRouterSelectors } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

export const PIPELINE_FILTERS = {
  myDeals: 'my-deals',
};

export const selectPipelineBoardButtonGroupNavigation = createSelector(
  routerQuery.selectActiveLine,
  (): ButtongroupNavigationModel => ({
    paramName: 'filter',
    filters: [
      {
        id: null,
        name: 'All deals',
        selected: true,
      },
      {
        id: PIPELINE_FILTERS.myDeals,
        name: 'My deals',
        selected: false,
      },
    ],
  }),
);

export const selectPipelineBoardNavigationDropdowns = createSelector(
  routerQuery.selectActiveLine,
  (): DropdownNavigationModel[] => [
    {
      queryParamName: 'stage',
      data: [],
      defaultItem: {
        name: 'All stages',
        id: null,
      },
      value: null,
      loading: false,
    },
    {
      queryParamName: 'dealLead',
      data: [],
      defaultItem: {
        name: 'Deal Lead',
        id: null,
      },
      value: null,
      loading: false,
    },
    {
      queryParamName: 'geography',
      data: [],
      defaultItem: {
        name: 'Geography',
        id: null,
      },
      value: null,
      loading: false,
    },
  ],
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
  (opportunities, filter, userEmail, searchQuery) => {
    let chain = _.chain(opportunities);

    if (filter === PIPELINE_FILTERS.myDeals) {
      chain = chain.filter(
        (o) =>
          o.fields?.some(
            (f) =>
              f.displayName === 'Deal Lead' &&
              'primary_email' in f &&
              f['primary_email'] === userEmail,
          ),
      );
    }

    if (searchQuery?.trim()) {
      chain = chain.filter(
        (o) =>
          o.organisation.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          o.organisation.domains.some((domain) =>
            domain.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    return chain
      .groupBy((o) => o.stage.id)
      .mapValues((opportunities) => opportunities.map(({ id }) => id))
      .value();
  },
);

export const selectPipelinesPageViewModel = createSelector(
  selectAllOpportunitiesDictionary,
  selectOportunitiesStageDictionary,
  selectAllPipelines,
  selectIsLoadingPipelineBoard,
  selectPipelineBoardNavigationDropdowns,
  selectPipelineBoardButtonGroupNavigation,

  (
    opportunitiesDictionary,
    opportunitiesStageDictionary,
    pipelines,
    isLoading,
    dropdowns,
    buttonGroups,
  ) => ({
    opportunitiesDictionary,
    opportunitiesStageDictionary,
    pipelines,
    isLoading,
    dropdowns,
    buttonGroups,
    pipelineQuery: null,
  }),
);
