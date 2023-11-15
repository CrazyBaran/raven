import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PipelineDefinitionModel } from './pipelines.model';

export const PipelinesActions = createActionGroup({
  source: 'Pipelines/API',
  events: {
    'Get Pipelines': emptyProps(),
    'Get Pipelines Success': props<{ data: PipelineDefinitionModel[] }>(),
    'Get Pipelines Failure': props<{ error: string }>(),

    'Clear Pipelines': emptyProps(),
  },
});
