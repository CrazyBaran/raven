import { authQuery } from '@app/client/core/auth';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotesState, notesAdapter, notesFeatureKey } from './notes.reducer';

export const { selectAll } = notesAdapter.getSelectors();

export const selectNotesState =
  createFeatureSelector<NotesState>(notesFeatureKey);

export const selectAllNotes = createSelector(
  selectNotesState,
  (state: NotesState) => selectAll(state),
);
export const selectIsLoading = createSelector(
  selectNotesState,
  (state: NotesState) => state.isLoading,
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
  selectAllNotes,
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

export const notesQuery = {
  selectAllNotes,
  selectIsLoading,
  selectError,
  selectNoteDetails,
  selectNoteDetailsIsLoading,
  selectNoteUpdateIsLoading,
  selectAllNotesTableRows,
};
