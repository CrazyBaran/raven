import { notesQuery } from '@app/client/opportunities/api-notes';
import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import {
  buildButtonGroupNavigation,
  buildDropdownNavigation,
  routerQuery,
} from '@app/client/shared/util-router';
import { tagsQuery } from '@app/client/tags/state';
import {
  selectTemplatesLoaded,
  templateQueries,
} from '@app/client/templates/data-access';
import { createSelector } from '@ngrx/store';
import { TagTypeEnum } from '../../../../../../../rvns-tags/src';

export const selectOpportunityNotesViewModel = createSelector(
  notesQuery.selectNotesTableParams,
  notesQuery.selectAllNotes,
  templateQueries.selectAllNoteTemplates,
  selectTemplatesLoaded,
  routerQuery.selectCurrentOrganisationId,
  opportunitiesQuery.selectRouteOpportunityDetails,
  tagsQuery.selectCurrentOrganisationTags,
  (
    params,
    notes,
    templates,
    templateLoaded,
    organisationId,
    opportuntiy,
    tags,
  ) => {
    const opportunityTagId =
      opportuntiy?.tag?.type === TagTypeEnum.Opportunity
        ? opportuntiy.tag.id
        : '';
    const versionTagId =
      opportuntiy?.tag?.type === TagTypeEnum.Version ? opportuntiy.tag.id : '';
    return {
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
      organisationId,
      organisationTagId: tags?.find((x) => x?.type === 'company')?.id,
      opportunityTagId,
      versionTagId,
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
    };
  },
);
