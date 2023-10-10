import { PipelineDefinitionData } from '@app/rvns-pipelines';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const PipelinesActions = createActionGroup({
  source: 'Pipelines/API',
  events: {
    'Get Pipelines': emptyProps(),
    'Get Pipelines Success': props<{ data: PipelineDefinitionData[] }>(),
    'Get Pipelines Failure': props<{ error: string }>(),

    'Clear Pipelines': emptyProps(),
  },
});
