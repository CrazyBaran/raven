import { CreateTagData, CreateTagResponse } from '@app/client/tags/data-access';

import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TagEntity } from './tags.model';

export const TagsActions = createActionGroup({
  source: 'Tags/API',
  events: {
    'Get Tags': emptyProps(),
    'Get Tags Success': props<{ data: TagEntity[] }>(),
    'Get Tags Failure': props<{ error: string }>(),

    'Get Tag By OrganisationId If Not Loaded': props<{
      organisationId: string;
    }>(),
    'Get Tag By OrganisationId If Not Loaded Success': props<{
      data: TagEntity[];
    }>(),
    'Get Tag By OrganisationId If Not Loaded Failure': props<{
      error: string;
    }>(),

    'Get Tags By Types': props<{
      tagTypes: TagEntity['type'][];
    }>(),

    'Get Tags By Types Success': props<{
      data: TagEntity[];
      tagTypes: TagEntity['type'][];
    }>(),
    'Get Tags By Types Failure': props<{
      error: string;
      tagTypes: TagEntity['type'][];
    }>(),

    'Get Tags By Types If Not Loaded': props<{
      tagTypes: TagEntity['type'][];
    }>(),

    'Create Tag': props<{ data: CreateTagData }>(),
    'Create Tag Success': props<{ data: CreateTagResponse }>(),
    'Create Tag Failure': props<{ error: string }>(),
  },
});
