//TODO: fix opportunity note typings
/* eslint-disable @typescript-eslint/no-explicit-any */

import { notesQuery } from '@app/client/opportunities/api-notes';
import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import { routerQuery } from '@app/client/shared/util-router';
import { getRouterSelectors } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';

import * as _ from 'lodash';

export const selectOpportunityNoteTabsDictionary = createSelector(
  opportunitiesQuery.selectOpportunityNoteTabs,
  (noteTabs) => _.keyBy(noteTabs, (x) => x.id),
);

export const selectActiveNoteTab = createSelector(
  selectOpportunityNoteTabsDictionary,
  routerQuery.selectActiveTab,
  (opportunityNotes, activeTab) => {
    return activeTab ? opportunityNotes[activeTab] : null;
  },
);

export const selectActiveNoteTabFieldGroup = createSelector(
  selectActiveNoteTab,
  (activeTab) => activeTab?.noteFieldGroups[0],
);

export const selectRelatedNotesWithFields = createSelector(
  selectActiveNoteTab,
  (tab): any =>
    tab && 'relatedNotesWithFields' in tab ? tab.relatedNotesWithFields : [],
);

export const selectRelatedNotes = createSelector(
  selectActiveNoteTab,
  (tab): any => (tab && 'relatedNotes' in tab ? tab.relatedNotes : []),
);

export const selectOpportunityRelatedNotes = createSelector(
  selectRelatedNotesWithFields,
  selectRelatedNotes,
  getRouterSelectors().selectQueryParam('noteIndex'),
  (notesWithFields, notes, visibleNoteWithFieldsIndex) => {
    const relatedNotes = notesWithFields.slice(0, 12);
    const index =
      visibleNoteWithFieldsIndex &&
      +visibleNoteWithFieldsIndex > 0 &&
      +visibleNoteWithFieldsIndex < relatedNotes.length
        ? +visibleNoteWithFieldsIndex
        : 0;

    return {
      notesWithFields,
      notes,
      visibleNoteWithFields: notesWithFields?.length
        ? notesWithFields[visibleNoteWithFieldsIndex ?? 0] ?? notesWithFields[0]
        : null,
      nextQueryParam: { noteIndex: index + 1 },
      disabledNext: index + 1 >= relatedNotes.length,
      prevQueryParam: { noteIndex: index - 1 },
      disabledPrev: index - 1 < 0,
      index: relatedNotes?.length ? index : -1,
    };
  },
);

export const selectNoteFields = createSelector(
  opportunitiesQuery.selectNoteFields,
  (notes) =>
    _.chain(notes)
      .groupBy((x) => x.tabId)
      .value(),
);

export const selectOpportunitiesRelatedNotesViewModel = createSelector(
  opportunitiesQuery.selectRouteOpportunityDetails,
  routerQuery.selectActiveTab,
  notesQuery.selectOpportunityNotes,
  selectOpportunityRelatedNotes,
  selectNoteFields,
  notesQuery.selectOpportunityNotesIsLoading,
  (opportunity, tab, opportunityNotes, relatedNotes, fields, isLoading) => {
    return {
      fields: fields[tab ?? ''] ?? [],
      relatedNoteFields: [],
      opportunityNote: opportunityNotes[0],
      opportunityNoteId: opportunityNotes[0]?.id,
      isLoading,
      ...relatedNotes,
    };
  },
);
