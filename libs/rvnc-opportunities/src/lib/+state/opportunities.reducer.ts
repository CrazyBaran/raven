import { OpportunityData } from '@app/rvns-opportunities';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { OpportunitiesActions } from './opportunities.actions';

export const opportunitiesFeatureKey = 'opportunities';

export interface OpportunitiesState extends EntityState<OpportunityData> {
  isLoading: boolean;
  error: string | null;
}

export const opportunitiesAdapter: EntityAdapter<OpportunityData> =
  createEntityAdapter<OpportunityData>();

export const initialState: OpportunitiesState =
  opportunitiesAdapter.getInitialState({
    // additional entity state properties
    isLoading: false,
    error: null,
  });

export const opportunitiesReducer = createReducer(
  initialState,
  on(OpportunitiesActions.getOpportunities, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(OpportunitiesActions.getOpportunitiesSuccess, (state, { data }) =>
    opportunitiesAdapter.setAll(data, { ...state, isLoading: false }),
  ),
  on(OpportunitiesActions.getOpportunitiesFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
);

export const opportunitiesFeature = createFeature({
  name: opportunitiesFeatureKey,
  reducer: opportunitiesReducer,
  extraSelectors: ({ selectOpportunitiesState }) => ({
    ...opportunitiesAdapter.getSelectors(selectOpportunitiesState),
  }),
});
