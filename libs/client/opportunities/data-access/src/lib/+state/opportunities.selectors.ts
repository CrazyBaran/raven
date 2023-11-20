import { getDealLeads, getDealTeam } from '@app/client/shared/util';
import { routerQuery } from '@app/client/shared/util-router';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import {
  OpportunitiesState,
  opportunitiesAdapter,
  opportunitiesFeatureKey,
} from './opportunities.reducer';

export const { selectAll, selectEntities } =
  opportunitiesAdapter.getSelectors();

export const selectOpportunitiesState =
  createFeatureSelector<OpportunitiesState>(opportunitiesFeatureKey);

export const selectAllOpportunities = createSelector(
  selectOpportunitiesState,
  (state: OpportunitiesState) => (state ? selectAll(state) : []),
);

export const selectIsLoading = createSelector(
  selectOpportunitiesState,
  (state: OpportunitiesState) => state.isLoading,
);

export const selectOpportunitiesDictionary = createSelector(
  selectOpportunitiesState,
  (state: OpportunitiesState) => (state ? selectEntities(state) : {}),
);

export const selectOpportunitiesGroupedByOrganisation = createSelector(
  selectAllOpportunities,
  (opportunities) =>
    _.groupBy(opportunities ?? [], ({ organisation }) => organisation.id),
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectOpportunityById = (id: string) =>
  createSelector(selectOpportunitiesDictionary, (dictionary) => dictionary[id]);
export const selectRouteOpportunityDetails = createSelector(
  selectOpportunitiesDictionary,
  routerQuery.selectCurrentOpportunityId,
  (opportunities, opportunityId) => {
    const opportunity = opportunities?.[opportunityId ?? ''];

    return (
      (opportunity && {
        ...opportunity,
        dealLeads: getDealLeads(opportunity?.fields ?? []),
        dealTeam: getDealTeam(opportunity?.fields ?? []),
        ndaTerminationDate: opportunity?.ndaTerminationDate
          ? new Date(opportunity?.ndaTerminationDate)
          : null,
      }) ??
      null
    );
  },
);

export const opportunitiesQuery = {
  selectAllOpportunities,
  selectIsLoading,
  selectOpportunitiesDictionary,
  selectRouteOpportunityDetails,
  selectOpportunityById,
  selectOpportunitiesGroupedByOrganisation,
};
