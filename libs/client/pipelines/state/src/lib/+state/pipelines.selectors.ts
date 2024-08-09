import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as _ from 'lodash';
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
export const selectAllPipelineStages = createSelector(
  selectAllPipelines,
  (pipelines) =>
    _.chain(pipelines)
      .flatMap(({ stages }) => stages)
      .sortBy('order')
      .value(),
);

export const selectAllPipelineViews = createSelector(
  selectAllPipelines,
  (pipelines) =>
    _.chain(pipelines)
      .flatMap(({ views }) => views)
      .sortBy('order')
      .value(),
);

export const selectPipelinesStagesDictionary = createSelector(
  selectAllPipelineStages,
  (pipelines) => _.chain(pipelines).keyBy('id').value(),
);

const selectStagePrimaryColorDictionary = createSelector(
  selectPipelinesStagesDictionary,
  (stages) => _.chain(stages).mapValues('primaryColor').value(),
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectPipelineById = (id: string) =>
  createSelector(
    selectPipelinesStagesDictionary,
    (dictionary) => dictionary?.[id],
  );

export const pipelinesQuery = {
  selectAllPipelines,
  selectIsLoading,
  selectPipelineById,
  selectStagePrimaryColorDictionary,
  selectAllPipelineStages,
  selectAllPipelineViews,
};
