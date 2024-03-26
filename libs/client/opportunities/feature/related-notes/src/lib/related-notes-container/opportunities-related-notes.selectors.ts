/* eslint-disable @nx/enforce-module-boundaries */
import { notesQuery } from '@app/client/opportunities/api-notes';
import {
  opportunitiesQuery,
  selectIsTeamMemberForCurrentOpportunity,
} from '@app/client/opportunities/data-access';
import { routerQuery } from '@app/client/shared/util-router';
import { getRouterSelectors } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';

import { filesQuery } from '@app/client/files/feature/state';
import * as _ from 'lodash';

export const selectOpportunityNoteTabsDictionary = createSelector(
  opportunitiesQuery.selectOpportunityNoteTabs,
  (noteTabs) => _.keyBy(noteTabs, (x) => x.name),
);

export const selectActiveNoteTab = createSelector(
  selectOpportunityNoteTabsDictionary,
  routerQuery.selectActiveTab,
  (opportunityNotes, activeTab) => {
    return activeTab ? opportunityNotes[activeTab] : null;
  },
);

export const selectRelatedNotesWithFields = createSelector(
  selectActiveNoteTab,
  (tab) =>
    (tab && 'relatedNotesWithFields' in tab
      ? tab.relatedNotesWithFields ?? []
      : []
    ).map((noteWithFields) => ({
      ...noteWithFields,
      template: noteWithFields.templateName,
      updatedAt: noteWithFields.fields.reduce(
        (date, field) =>
          !date || field.updatedAt > date ? field.updatedAt : date,
        null as Date | null,
      ),
      createdBy: noteWithFields.createdBy.name,
      fields: noteWithFields.fields.map((field) => ({
        ...field,
        value: field.value ?? '',
      })),
    })),
);

export const selectRelatedNotes = createSelector(selectActiveNoteTab, (tab) =>
  tab && 'relatedNotes' in tab ? tab.relatedNotes : [],
);

export const selectOpportunityRelatedNotes = createSelector(
  selectRelatedNotesWithFields,
  selectRelatedNotes,
  getRouterSelectors().selectQueryParam('noteIndex'),
  (notesWithFields, notes, visibleNoteWithFieldsIndex) => {
    const index =
      visibleNoteWithFieldsIndex &&
      +visibleNoteWithFieldsIndex > 0 &&
      +visibleNoteWithFieldsIndex < notesWithFields.length
        ? +visibleNoteWithFieldsIndex
        : 0;

    return {
      notesWithFields,
      notes,
      visibleNoteWithFields: notesWithFields?.length
        ? notesWithFields[Number(visibleNoteWithFieldsIndex ?? 0)] ??
          notesWithFields[0]
        : null,
      nextQueryParam: { noteIndex: index + 1 },
      disabledNext: index + 1 >= notesWithFields.length,
      prevQueryParam: { noteIndex: index - 1 },
      disabledPrev: index - 1 < 0,
      index: notesWithFields?.length ? index : -1,
    };
  },
);

export const selectOpportunitiesRelatedNotesViewModel = createSelector(
  opportunitiesQuery.selectRouteOpportunityDetails,
  selectOpportunityRelatedNotes,
  notesQuery.selectOpportunityNotesIsLoading,
  selectIsTeamMemberForCurrentOpportunity,
  routerQuery.selectActiveTab,
  filesQuery.selectFilesTags,
  (
    opportuniity,
    relatedNotes,
    isLoading,
    isMember,
    activeTab,
    fileTagDictionary,
  ) => {
    return {
      directoryUrl: opportuniity?.sharePointDirectory,
      isLoading,
      canEditFields: isMember,
      activeTab,
      fileTagDictionary,
      ...relatedNotes,
    };
  },
);
