import { NoteData, NoteWithRelationsData } from '@app/rvns-notes/data-access';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CreateNote, PatchNote } from '../domain/createNote';

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

    'Create Note': props<{ data: CreateNote }>(),
    'Create Note Success': props<{ data: NoteData }>(),
    'Create Note Failure': props<{ error: string }>(),

    'Update Note': props<{ noteId: string; data: PatchNote }>(),
    'Update Note Success': props<{ data: NoteData }>(),
    'Update Note Failure': props<{ error: string }>(),
  },
});
