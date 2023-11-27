//TODO: fix colors boundaries
/* eslint-disable @nx/enforce-module-boundaries */
import { authQuery } from '@app/client/core/auth';
import { BadgeStyle } from '@app/client/shared/ui';
import { buildPageParamsSelector } from '@app/client/shared/util-router';
import { templateQueries } from '@app/client/templates/data-access';
import { NoteData } from '@app/rvns-notes/data-access';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { notesQueries } from '../domain/get-notes.params';
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

const selectNotesTableParams = buildPageParamsSelector(notesQueries, {
  take: '15',
  skip: '0',
  field: 'updatedAt',
  dir: 'desc',
});

const selectTotal = createSelector(
  selectNotesState,
  (state) => state.table.total,
);

export const NOTE_TYPE_BADGE_COLORS: BadgeStyle[] = [
  {
    backgroundColor: '#00CCBE80',
    color: '#000000',
  },
  {
    backgroundColor: '#77B8E480',
    color: '#000000',
  },
  {
    backgroundColor: '#F0882D80',
    color: '#000000',
  },
  {
    backgroundColor: '#D8466180',
    color: '#000000',
  },
  {
    backgroundColor: '#FDDC49',
    color: '#000000',
  },
  {
    backgroundColor: '#D281D980',
    color: '#000000',
  },
];

const selectNotesTypeBadgeColors = createSelector(
  templateQueries.selectAllNoteTemplates,
  (templates): Record<string, BadgeStyle> => {
    return _.chain(templates)
      .map((t, index) => ({
        ...t,
        styles: NOTE_TYPE_BADGE_COLORS[index] ?? {
          backgroundColor: '#e0e0e0',
          color: '#000000',
        },
      }))
      .keyBy(({ name }) => name)
      .mapValues(({ styles }) => styles)
      .value();
  },
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
  selectNotesTypeBadgeColors,
};
