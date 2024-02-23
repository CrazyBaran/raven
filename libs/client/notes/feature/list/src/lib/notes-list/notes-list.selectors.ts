import { notesQuery } from '@app/client/notes/state';
import {
  buildButtonGroupNavigation,
  buildInputNavigation,
} from '@app/client/shared/util-router';
import { templateQueries } from '@app/client/templates/data-access';
import { createSelector } from '@ngrx/store';

export const selectNotesListViewModel = createSelector(
  notesQuery.selectNotesTableParams,
  templateQueries.selectAllNoteTemplates,
  (params, templates) => ({
    queryModel: buildInputNavigation({
      params,
      name: 'query',
      placeholder: 'Search Notes',
    }),
    buttonGroupTemplates: buildButtonGroupNavigation({
      params,
      name: 'noteType',
      toggleable: true,
      buttons: [
        {
          id: null,
          name: 'All Note Types',
        },
        ...templates.map((template) => ({
          id: template.name,
          name: template.name,
        })),
      ],
      staticQueryParams: { skip: null },
    }),
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
  }),
);
