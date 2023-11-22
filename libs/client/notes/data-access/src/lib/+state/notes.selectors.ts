import { authQuery } from '@app/client/core/auth';
import { buildPageParamsSelector } from '@app/client/shared/util-router';
import { NoteData } from '@app/rvns-notes/data-access';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NOTES_QUERY_DEFAULTS, notesQueries } from '../domain/get-notes.params';
import { NotesState, notesAdapter, notesFeatureKey } from './notes.reducer';

export const { selectAll, selectEntities } = notesAdapter.getSelectors();

export const selectNotesState =
  createFeatureSelector<NotesState>(notesFeatureKey);

export const selectAllNotes = createSelector(
  selectNotesState,
  (state: NotesState) => selectAll(state),
);

export const selectNotesDictionary = createSelector(
  selectNotesState,
  (state: NotesState) => selectEntities(state),
);

export const selectTableNotes = createSelector(
  selectNotesState,
  (state: NotesState) =>
    state.table.ids
      .map((id) => state.entities[id])
      .filter(Boolean) as NoteData[],
);

export const selectIsTableLoading = createSelector(
  selectNotesState,
  (state: NotesState) => state.table.isLoading,
);

export const selectError = createSelector(
  selectNotesState,
  (state: NotesState) => state.error,
);

export const selectNoteDetails = createSelector(
  selectNotesState,
  (state: NotesState) => state.details.data,
);

export const selectNoteDetailsIsLoading = createSelector(
  selectNotesState,
  (state: NotesState) => state.details.isLoading,
);

export const selectNoteUpdateIsLoading = createSelector(
  selectNotesState,
  (state: NotesState) => state.update.isLoading,
);

export const selectAllNotesTableRows = createSelector(
  selectTableNotes,
  authQuery.selectUserEmail,
  (notes, userEmail) =>
    notes.map((note) => ({
      ...note,
      deleteButtonSettings: {
        disabled: note.createdBy?.email !== userEmail,
        tooltip:
          note.createdBy?.email !== userEmail
            ? 'You can only delete your own notes'
            : '',
      },
    })),
);

const selectOpportunityNotesState = createSelector(
  selectNotesState,
  (state: NotesState) => state.opportunityNotes,
);

const selectOpportunityNotes = createSelector(
  selectOpportunityNotesState,
  (state) => state.data,
);

const selectOpportunityNotesIsLoading = createSelector(
  selectOpportunityNotesState,
  (state) => state.isLoading,
);

const selectNotesTableParams = buildPageParamsSelector(
  notesQueries,
  NOTES_QUERY_DEFAULTS,
);

const selectTotal = createSelector(
  selectNotesState,
  (state) => state.table.total,
);

export const notesQuery = {
  selectAllNotes,
  selectIsTableLoading,
  selectError,
  selectNoteDetails,
  selectNoteDetailsIsLoading,
  selectNoteUpdateIsLoading,
  selectAllNotesTableRows,
  selectOpportunityNotes,
  selectOpportunityNotesIsLoading,
  selectNotesDictionary,
  selectNotesTableParams,
  selectTotal,
};
