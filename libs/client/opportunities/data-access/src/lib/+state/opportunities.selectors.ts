import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  OpportunitiesState,
  opportunitiesAdapter,
  opportunitiesFeatureKey,
} from './opportunities.reducer';

export const { selectAll } = opportunitiesAdapter.getSelectors();

export const selectOpportunitiesState =
  createFeatureSelector<OpportunitiesState>(opportunitiesFeatureKey);

export const selectAllOpportunities = createSelector(
  selectOpportunitiesState,
  (state: OpportunitiesState) => selectAll(state),
);

export const selectIsLoading = createSelector(
  selectOpportunitiesState,
  (state: OpportunitiesState) => state.isLoading,
);

export const selectDetails = createSelector(
  selectOpportunitiesState,
  (state: OpportunitiesState) => state.details,
);

export const opportunitiesQuery = {
  selectAllOpportunities,
  selectIsLoading,
  selectDetails,
};
