import { NoteData, NoteWithRelationsData } from '@app/rvns-notes/data-access';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CreateNote, PatchNote } from '../domain/createNote';

export const NotesActions = createActionGroup({
  source: 'Notes/API',
  events: {
    'Get Notes': props<{
      domain?: string;
      tagIds?: string;
      opportunityId?: string;
    }>(),
    'Get Notes Success': props<{ data: NoteData[] }>(),
    'Get Notes Failure': props<{ error: string }>(),

    'Get Current Note Details': emptyProps(),

    'Clear Notes': emptyProps(),
    'Get Note Details': props<{ id: string }>(),
    'Get Note Details Success': props<{ data: NoteWithRelationsData }>(),
    'Get Note Details Failure': props<{ error: string }>(),

    'Create Note': props<{ data: CreateNote }>(),
    'Create Note Success': props<{ data: NoteWithRelationsData }>(),
    'Create Note Failure': props<{ error: string }>(),

    'Update Note': props<{ noteId: string; data: PatchNote }>(),
    'Update Note Success': props<{
      data: NoteWithRelationsData;
      originId: string;
    }>(),
    'Update Note Failure': props<{ error: string }>(),

    'Delete Note': props<{ noteId: string }>(),
    'Delete Note Success': props<{ noteId: string }>(),
    'Delete Note Failure': props<{ error: string }>(),

    'Get Opportunity Notes': props<{ opportunityId: string }>(),
    'Get Opportunity Notes Success': props<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: (any | NoteWithRelationsData)[];
    }>(),
    'Get Opportunity Notes Failure': props<{ error: string }>(),
  },
});
