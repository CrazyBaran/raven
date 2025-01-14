import {
  CreateNote,
  NoteQueryParams,
  PatchNote,
} from '@app/client/notes/data-access';
import {
  NoteData,
  NoteWithRelationsData,
  WorkflowNoteData,
} from '@app/rvns-notes/data-access';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const NotesActions = createActionGroup({
  source: 'Notes/API',
  events: {
    'Open Notes Table': emptyProps(),

    'Get Notes': props<{
      params: NoteQueryParams;
      silently?: boolean;
      append?: boolean;
    }>(),
    'Get Notes Success': props<{
      data: NoteData[];
      total: number;
      append?: boolean;
    }>(),
    'Get Notes Failure': props<{ error: string }>(),

    'Get Note Attachments': props<{ id: string }>(),
    'Get Notes Attachments Success': props<{ id: string }>(),
    'Get Notes Attachments Failure': props<{ id: string }>(),

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
    'Update Note Failure': props<{ error: string; originId: string }>(),

    'Refresh Note': props<{ noteId: string; newSyncId: string }>(),
    'Refresh Note Success': props<{
      originId: string;
    }>(),
    'Refresh Note Failure': props<{ error: string; originId: string }>(),

    'Delete Note': props<{ noteId: string }>(),
    'Delete Note Success': props<{ noteId: string }>(),
    'Delete Note Failure': props<{ error: string }>(),

    'Get Opportunity Notes': props<{
      opportunityId: string;
      silently?: boolean;
    }>(),
    'Get Opportunity Notes Success': props<{
      data: WorkflowNoteData[];
    }>(),
    'Get Opportunity Notes Failure': props<{ error: string }>(),

    'Update Opportunity Note': props<{
      noteId: string;
      data: PatchNote;
      changedFields: string[];
    }>(),

    'Refresh Notes Table': emptyProps(),
    'Refresh Notes Table Success': props<{
      data: NoteData[];
      total: number;
    }>(),
    'Refresh Notes Table Failure': props<{ error: string }>(),

    'Toggle Disabled Note Tabs': props<{
      id: string;
      label: string;
    }>(),
    'Replace Disabled Note Tabs': props<{
      beforeSaveTabIds: Array<string>;
      afterSave: Array<{
        id: string;
        label: string;
      }>;
    }>(),

    //websocket events
    'Live Create Note': props<{ id: string }>(),
    'Live Change Note': props<{ id: string; newSyncId: string }>(),
    'Live Delete Note': props<{ id: string }>(),
  },
});
