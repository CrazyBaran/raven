import { notesQuery } from '@app/client/notes/data-access';
import { routerQuery } from '@app/client/shared/util-router';
import {
  selectAllNoteTemplates,
  selectTemplatesLoaded,
} from '@app/client/templates/data-access';
import { getRouterSelectors } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';

const NOTE_FILTERS = [
  {
    name: 'All Notes',
    id: null,
  },
  {
    name: 'Created by me',
    id: 'created',
  },
  {
    name: 'I am tagged',
    id: 'tagged',
  },
];

const selectNoteType = getRouterSelectors().selectQueryParam('noteType');

const selectNoteTypesDropdown = createSelector(
  selectAllNoteTemplates,
  selectTemplatesLoaded,
  selectNoteType,
  (templates, templateLoaded, templateId) => ({
    data: templates.map((t) => ({
      name: t.name,
      id: t.name,
    })),
    textField: 'name',
    valueField: 'id',
    defaultItem: {
      name: 'All Notes Types',
      id: null,
    },
    loading: !templateLoaded,
    value: templates.find(({ id }) => id === templateId),
  }),
);

const selectNoteFilters = createSelector(
  getRouterSelectors().selectQueryParam('filter'),
  (filter) =>
    NOTE_FILTERS.map((f) => ({
      ...f,
      selected: f.id === (filter ?? NOTE_FILTERS[0].id), //undefined !== null
    })),
);

export const selectOpportunityNotesViewModel = createSelector(
  selectNoteTypesDropdown,
  notesQuery.selectAllNotes,
  selectNoteFilters,
  routerQuery.selectActiveNoteId,
  (noteTypesDropdown, notes, filters, noteId) => ({
    filters,
    noteTypesDropdown,
    notes,
    noteId,
  }),
);
