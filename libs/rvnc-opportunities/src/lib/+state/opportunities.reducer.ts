import { OpportunityData } from '@app/rvns-opportunities';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { OpportunitiesActions } from './opportunities.actions';

export const opportunitiesFeatureKey = 'opportunities';

export interface State extends EntityState<OpportunityData> {
  isLoading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<OpportunityData> =
  createEntityAdapter<OpportunityData>();

export const initialState: State = adapter.getInitialState({
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
    adapter.setAll(data, { ...state, isLoading: false }),
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
    ...adapter.getSelectors(selectOpportunitiesState),
  }),
});

export const { selectIds, selectEntities, selectAll, selectTotal } =
  opportunitiesFeature;
