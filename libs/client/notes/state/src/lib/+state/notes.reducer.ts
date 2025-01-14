import {
  NoteData,
  NoteWithRelationsData,
  WorkflowNoteData,
} from '@app/rvns-notes/data-access';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { NotesActions } from './notes.actions';

export const notesFeatureKey = 'notes';

export type NoteEntity = NoteData & {
  newSyncId?: string;
};

export interface NotesState extends EntityState<NoteEntity> {
  // additional entities state properties
  isLoading: boolean;
  error: string | null;
  table: {
    isLoading: boolean;
    ids: string[];
    total: number;
  };
  create: {
    isLoading: boolean;
    error: string | null;
  };
  update: {
    isLoading: boolean;
    error: string | null;
  };
  delete: {
    isPending: boolean;
    error: string | null;
  };
  details: {
    isLoading: boolean;
    isPending: boolean;
    data: NoteWithRelationsData | null;
  };
  opportunityNotes: {
    data: WorkflowNoteData[];
    isLoading: boolean;
  };
  disabledNoteTabs: Array<{ id: string; label: string }>;
}

export const notesAdapter: EntityAdapter<NoteEntity> =
  createEntityAdapter<NoteEntity>();

export const initialState: NotesState = notesAdapter.getInitialState({
  // additional entity state properties
  isLoading: false,
  error: null,
  table: {
    isLoading: false,
    ids: [],
    total: 0,
  },
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
  delete: {
    isPending: false,
    error: null,
  },
  opportunityNotes: {
    data: [],
    isLoading: false,
  },
  disabledNoteTabs: [],
});

export const notesReducer = createReducer(
  initialState,
  on(NotesActions.openNotesTable, (state) => ({
    ...state,
    table: {
      ...state.table,
      total: 0,
      ids: [],
    },
  })),
  on(NotesActions.getNotes, (state, action) => ({
    ...state,
    table: {
      ...state.table,
      isLoading: !action.silently,
    },
  })),
  on(NotesActions.getNotesSuccess, (state, { data, total, append }) =>
    notesAdapter.upsertMany(data, {
      ...state,
      table: {
        isLoading: false,
        ids: append
          ? [...(state.table.ids ?? []), ...data.map((note) => note.id)]
          : data.map((note) => note.id),
        total: total,
      },
    }),
  ),
  on(NotesActions.refreshNotesTableSuccess, (state, { data, total }) =>
    notesAdapter.upsertMany(data, {
      ...state,
      table: {
        isLoading: false,
        ids: data.map((note) => note.id),
        total: total,
      },
    }),
  ),
  on(NotesActions.getNotesFailure, (state, { error }) => ({
    ...state,
    table: {
      ...state.table,
      isLoading: false,
    },
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

  on(NotesActions.getNoteDetailsSuccess, (state, { data }) =>
    notesAdapter.upsertOne(data, {
      ...state,
      details: {
        ...state.details,
        isLoading: false,
        data,
      },
    }),
  ),

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
        opportunityNotes:
          data.name === state.opportunityNotes.data?.[0]?.name
            ? {
                ...state.opportunityNotes,
                data: [
                  {
                    ...data,
                    noteTabs: data.noteTabs.map((tab, i) => ({
                      ...tab,
                      pipelineStages:
                        state.opportunityNotes.data?.[0]?.noteTabs?.[i]
                          ?.pipelineStages,
                      relatedNotes:
                        state.opportunityNotes.data?.[0]?.noteTabs?.[i]
                          ?.relatedNotes,
                      relatedNotesWithFields:
                        state.opportunityNotes.data?.[0]?.noteTabs?.[i]
                          ?.relatedNotesWithFields,
                      noteFieldGroups: data.noteTabs[i].noteFieldGroups?.map(
                        (group, j) => ({
                          ...group,
                          noteFields: group.noteFields?.map((field, h) => ({
                            ...field,
                            hideOnPipelineStages:
                              state.opportunityNotes.data?.[0]?.noteTabs?.[i]
                                ?.noteFieldGroups?.[j]?.noteFields?.[h]
                                ?.hideOnPipelineStages,
                          })),
                        }),
                      ),
                    })),
                  },
                ] as WorkflowNoteData[],
              }
            : state.opportunityNotes,
        table: {
          ...state.table,
          ids: state.table.ids.map((id) => (id === originId ? data.id : id)),
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

  on(NotesActions.deleteNote, (state) => ({
    ...state,
    delete: {
      ...state.delete,
      isPending: true,
    },
  })),
  on(NotesActions.deleteNoteSuccess, (state, { noteId }) =>
    notesAdapter.removeOne(noteId, {
      ...state,
      delete: {
        ...state.delete,
        isPending: false,
        error: null,
      },
    }),
  ),
  on(NotesActions.deleteNoteFailure, (state, { error }) => ({
    ...state,
    delete: {
      ...state.delete,
      isPending: false,
      error,
    },
  })),

  on(NotesActions.getOpportunityNotes, (state, { silently }) => ({
    ...state,
    opportunityNotes: {
      ...state.opportunityNotes,
      data: silently ? state.opportunityNotes.data : [],
      isLoading: !silently,
    },
  })),
  on(NotesActions.getOpportunityNotesSuccess, (state, action) => ({
    ...state,
    opportunityNotes: {
      data: action.data,
      isLoading: false,
    },
  })),
  on(NotesActions.getOpportunityNotesFailure, (state) => ({
    ...state,
    opportunityNotes: {
      ...state.opportunityNotes,
      isLoading: false,
    },
  })),
  on(NotesActions.toggleDisabledNoteTabs, (state, { id, label }) => ({
    ...state,
    disabledNoteTabs: state.disabledNoteTabs.find((tab) => tab.id === id)
      ? state.disabledNoteTabs.filter((tab) => tab.id !== id)
      : [...state.disabledNoteTabs, { id, label }],
  })),
  on(
    NotesActions.replaceDisabledNoteTabs,
    (state, { beforeSaveTabIds, afterSave }) => {
      // NOTE: before create/update note, fields have different ids than after save - we have note versioning
      // so we need to replace disabled note tabs with new ids after save
      const replacedDisabledNoteTabs = state.disabledNoteTabs.slice();

      beforeSaveTabIds.forEach((tabId) => {
        const tabIndex = replacedDisabledNoteTabs.findIndex(
          (el) => el.id === tabId,
        );

        if (tabIndex !== -1) {
          const newItem = afterSave.find(
            (el) => el.label === replacedDisabledNoteTabs[tabIndex].label,
          );

          if (newItem) {
            replacedDisabledNoteTabs.push(newItem);
          }

          replacedDisabledNoteTabs.splice(tabIndex, 1);
        }
      });

      return {
        ...state,
        disabledNoteTabs: replacedDisabledNoteTabs,
      };
    },
  ),
  on(NotesActions.liveChangeNote, (state, { id, newSyncId }) =>
    notesAdapter.updateOne(
      {
        id,
        changes: {
          newSyncId: newSyncId,
        },
      },
      state,
    ),
  ),
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
