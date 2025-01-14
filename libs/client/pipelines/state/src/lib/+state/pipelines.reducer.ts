import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { PipelinesActions } from './pipelines.actions';
import { PipelineDefinitionModel } from './pipelines.model';

export const pipelinesFeatureKey = 'pipelines';

export interface PipelinesState extends EntityState<PipelineDefinitionModel> {
  // additional entities state properties
  isLoading: boolean;
  error: string | null;
}

export const pipelinesAdapter: EntityAdapter<PipelineDefinitionModel> =
  createEntityAdapter<PipelineDefinitionModel>();

export const initialState: PipelinesState = pipelinesAdapter.getInitialState({
  // additional entity state properties
  isLoading: false,
  error: null,
});

export const pipelinesReducer = createReducer(
  initialState,
  on(PipelinesActions.getPipelines, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(PipelinesActions.getPipelinesSuccess, (state, { data }) =>
    pipelinesAdapter.setAll(data, { ...state, isLoading: false }),
  ),
  on(PipelinesActions.getPipelinesFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
);

export const pipelinesFeature = createFeature({
  name: pipelinesFeatureKey,
  reducer: pipelinesReducer,
  extraSelectors: ({ selectPipelinesState }) => ({
    ...pipelinesAdapter.getSelectors(selectPipelinesState),
  }),
});
