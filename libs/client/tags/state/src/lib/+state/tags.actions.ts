import { CreateTagData, CreateTagResponse } from '@app/client/tags/data-access';

import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TagEntity } from './tags.model';

export const TagsActions = createActionGroup({
  source: 'Tags/API',
  events: {
    'Get Tags': emptyProps(),
    'Get Tags Success': props<{ data: TagEntity[] }>(),
    'Get Tags Failure': props<{ error: string }>(),

    'Create Tag': props<{ data: CreateTagData }>(),
    'Create Tag Success': props<{ data: CreateTagResponse }>(),
    'Create Tag Failure': props<{ error: string }>(),
  },
});
