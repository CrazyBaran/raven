import { notesQuery } from '@app/client/opportunities/api-notes';
import {
  buildButtonGroupNavigation,
  buildDropdownNavigation,
} from '@app/client/shared/util-router';
import {
  selectTemplatesLoaded,
  templateQueries,
} from '@app/client/templates/data-access';
import { createSelector } from '@ngrx/store';

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
