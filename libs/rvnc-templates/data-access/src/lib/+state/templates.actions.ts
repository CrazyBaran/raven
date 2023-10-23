import { TemplateData, TemplateWithRelationsData } from '@app/rvns-templates';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const TemplateActions = createActionGroup({
  source: 'Templates/API',
  events: {
    'Get Templates': emptyProps(),
    'Get Templates Success': props<{ data: TemplateWithRelationsData[] }>(),
    'Get Templates Failure': props<{ error: string }>(),

    'Get Template': props<{ id: TemplateData['id'] }>(),
    'Get Template Success': props<{ data: TemplateWithRelationsData }>(),
    'Get Template Failure': props<{ error: string }>(),
    'Get Template If Not Loaded': emptyProps(),
  },
});
