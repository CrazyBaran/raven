import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  PipelinesState,
  pipelinesAdapter,
  pipelinesFeatureKey,
} from './pipelines.reducer';

export const { selectAll } = pipelinesAdapter.getSelectors();

export const selectPipelinesState =
  createFeatureSelector<PipelinesState>(pipelinesFeatureKey);

export const selectAllPipelines = createSelector(
  selectPipelinesState,
  (state: PipelinesState) => selectAll(state),
);

export const selectIsLoading = createSelector(
  selectPipelinesState,
  (state: PipelinesState) => state.isLoading,
);
