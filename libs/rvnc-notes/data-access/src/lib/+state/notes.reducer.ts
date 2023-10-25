import { NoteData, NoteWithRelationsData } from '@app/rvns-notes/data-access';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { NotesActions } from './notes.actions';

export const notesFeatureKey = 'notes';

export interface NotesState extends EntityState<NoteData> {
  // additional entities state properties
  isLoading: boolean;
  error: string | null;
  create: {
    isLoading: boolean;
    error: string | null;
  };
  update: {
    isLoading: boolean;
    error: string | null;
  };
  details: {
    isLoading: boolean;
    isPending: boolean;
    data: NoteWithRelationsData | null;
  };
}

export const notesAdapter: EntityAdapter<NoteData> =
  createEntityAdapter<NoteData>();

export const initialState: NotesState = notesAdapter.getInitialState({
  // additional entity state properties
  isLoading: false,
  error: null,
  details: {
    isLoading: false,
    isPending: false,
    data: null,
  },
  create: {
    isLoading: false,
    error: null,
  },
  update: {
    isLoading: false,
    error: null,
  },
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

  on(NotesActions.createNote, (state) => ({
    ...state,
    create: {
      ...state.create,
      isLoading: true,
    },
  })),

  on(NotesActions.createNoteFailure, (state, { error }) => ({
    ...state,
    create: {
      ...state.create,
      isLoading: false,
      error,
    },
  })),

  on(NotesActions.createNoteSuccess, (state, { data }) =>
    notesAdapter.addOne(data, {
      ...state,
      create: {
        ...state.create,
        isLoading: false,
        error: null,
      },
    }),
  ),

  on(NotesActions.clearNotes, (state) => notesAdapter.removeAll(state)),

  on(NotesActions.getNoteDetails, (state) => ({
    ...state,
    details: {
      ...state.details,
      isLoading: true,
    },
  })),

  on(NotesActions.getNoteDetailsSuccess, (state, { data }) => ({
    ...state,
    details: {
      ...state.details,
      isLoading: false,
      data,
    },
  })),
  on(NotesActions.getNoteDetailsFailure, (state, { error }) => ({
    ...state,
    error,
    details: {
      ...state.details,
      isLoading: false,
    },
  })),
  on(NotesActions.updateNote, (state) => ({
    ...state,
    update: {
      ...state.update,
      isLoading: true,
    },
  })),
  on(NotesActions.updateNoteSuccess, (state, { data, originId }) =>
    notesAdapter.updateOne(
      { id: originId, changes: data },
      {
        ...state,
        update: {
          ...state.update,
          isLoading: false,
          error: null,
        },
        details: {
          ...state.details,
          data: data,
        },
      },
    ),
  ),
  on(NotesActions.updateNoteFailure, (state, { error }) => ({
    ...state,
    update: {
      ...state.update,
      isLoading: false,
      error,
    },
  })),
);

export const notesFeature = createFeature({
  name: notesFeatureKey,
  reducer: notesReducer,
  extraSelectors: ({ selectNotesState }) => ({
    ...notesAdapter.getSelectors(selectNotesState),
    selectIsCreatePending: createSelector(
      selectNotesState,
      (state) => state.create.isLoading,
    ),
  }),
});
