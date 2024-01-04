import { notesQuery } from '@app/client/notes/state';
import {
  buildButtonGroupNavigation,
  buildDropdownNavigation,
} from '@app/client/shared/util-router';
import {
  selectAllNoteTemplates,
  selectTemplatesLoaded,
  templateQueries,
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
  notesQuery.selectNotesTableParams,
  notesQuery.selectAllNotes,
  templateQueries.selectAllNoteTemplates,
  selectTemplatesLoaded,
  (params, notes, templates, templateLoaded) => ({
    notes,
    buttonGroupAssignedTo: buildButtonGroupNavigation({
      params,
      name: 'role',
      toggleable: true,
      buttons: [
        {
          id: null,
          name: 'All Notes',
        },
        {
          id: 'created',
          name: 'Created by me',
        },
        {
          id: 'tagged',
          name: 'I am tagged',
        },
      ],
      staticQueryParams: { skip: null },
    }),
    dropdownTemplates: buildDropdownNavigation({
      params,
      name: 'noteType',
      data: templates.map((template) => ({
        id: template.name,
        name: template.name,
      })),
      loading: !templateLoaded,
      defaultItem: {
        name: 'All Notes Types',
        id: null,
      },
    }),
  }),
);
