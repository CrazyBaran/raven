import { NoteData, NoteWithRelationsData } from '@app/rvns-notes/data-access';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const NotesActions = createActionGroup({
  source: 'Notes/API',
  events: {
    'Get Notes': emptyProps(),
    'Get Notes Success': props<{ data: NoteData[] }>(),
    'Get Notes Failure': props<{ error: string }>(),

    'Clear Notes': emptyProps(),

    'Get Note Details': props<{ id: string }>(),
    'Get Note Details Success': props<{ data: NoteWithRelationsData }>(),
    'Get Note Details Failure': props<{ error: string }>(),
  },
});
