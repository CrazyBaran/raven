import { NoteData } from '@app/rvns-notes/data-access';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const NotesActions = createActionGroup({
  source: 'Notes/API',
  events: {
    'Get Notes': emptyProps(),
    'Get Notes Success': props<{ data: NoteData[] }>(),
    'Get Notes Failure': props<{ error: string }>(),

    'Clear Notes': emptyProps(),
  },
});
