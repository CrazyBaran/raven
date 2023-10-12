import { NoteData } from '@app/rvns-notes';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { NotesActions } from './notes.actions';

export const notesFeatureKey = 'notes';

export interface NotesState extends EntityState<NoteData> {
  // additional entities state properties
  isLoading: boolean;
  error: string | null;
}

export const notesAdapter: EntityAdapter<NoteData> =
  createEntityAdapter<NoteData>();

export const initialState: NotesState = notesAdapter.getInitialState({
  // additional entity state properties
  isLoading: false,
  error: null,
});

export const notesReducer = createReducer(
  initialState,
  on(NotesActions.getNotes, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(NotesActions.getNotesSuccess, (state, { data }) =>
    notesAdapter.setAll(data, {
      ...state,
      isLoading: false,
      error: null,
    }),
  ),
  on(NotesActions.getNotesFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(NotesActions.clearNotes, (state) => notesAdapter.removeAll(state)),
);

export const notesFeature = createFeature({
  name: notesFeatureKey,
  reducer: notesReducer,
  extraSelectors: ({ selectNotesState }) => ({
    ...notesAdapter.getSelectors(selectNotesState),
  }),
});
