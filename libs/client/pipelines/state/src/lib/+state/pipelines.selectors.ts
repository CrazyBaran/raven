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

export const selectPipelinesDictionary = createSelector(
  selectPipelinesState,
  (state: PipelinesState) =>
    pipelinesAdapter.getSelectors().selectEntities(state),
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectPipelineById = (id: string) =>
  createSelector(selectPipelinesDictionary, (dictionary) => dictionary[id]);

export const pipelinesQuery = {
  selectAllPipelines,
  selectIsLoading,
  selectPipelineById,
};
