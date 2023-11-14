import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PipelineDefinition } from './pipelines.model';

export const PipelinesActions = createActionGroup({
  source: 'Pipelines/API',
  events: {
    'Get Pipelines': emptyProps(),
    'Get Pipelines Success': props<{ data: PipelineDefinition[] }>(),
    'Get Pipelines Failure': props<{ error: string }>(),

    'Clear Pipelines': emptyProps(),
  },
});
