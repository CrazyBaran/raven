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
