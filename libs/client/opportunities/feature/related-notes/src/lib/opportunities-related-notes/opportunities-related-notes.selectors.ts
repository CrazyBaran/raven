//TODO: fix opportunity note typings
/* eslint-disable @typescript-eslint/no-explicit-any */

import { notesQuery } from '@app/client/opportunities/api-notes';
import {
  opportunitiesQuery,
  selectFinancialGroups,
} from '@app/client/opportunities/data-access';
import { routerQuery } from '@app/client/shared/util-router';
import { getRouterSelectors } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';

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
  (tab) => {
    return tab && 'relatedNotesWithFields' in tab
      ? tab.relatedNotesWithFields ?? []
      : [];
  },
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

export const selectNoteFields = createSelector(
  opportunitiesQuery.selectNoteFields,
  (notes) =>
    _.chain(notes)
      .groupBy(({ tabName }) => tabName)
      .value(),
);

export const selectOpportunitiesRelatedNotesViewModel = createSelector(
  routerQuery.selectActiveTab,
  notesQuery.selectOpportunityNotes,
  selectOpportunityRelatedNotes,
  selectNoteFields,
  selectFinancialGroups,
  notesQuery.selectOpportunityNotesIsLoading,
  routerQuery.selectCurrentOpportunityId,
  (
    tab,
    opportunityNotes,
    relatedNotes,
    fields,
    financialGroups,
    isLoading,
    opportunityId,
  ) => {
    const tabFields = fields[tab ?? ''] ?? [];
    return {
      allFields: Object.values(fields).flat(),
      visibleFields: tabFields
        .filter((f) => f.type === 'field' && f.flat)
        .map((f) => ({
          title: f.title,
          formControlName: f.uniqId,
        })),
      heatmapFields: financialGroups.filter((x) => x.tabName === tab),
      fields: tabFields,
      fieldValues: _.chain(tabFields)
        .mapKeys(({ id }) => id)
        .mapValues(({ value }) => value)
        .value(),
      opportunityNote: opportunityNotes[0],
      opportunityNoteId: opportunityNotes[0]?.id,
      isLoading,
      opportunityId,
      ...relatedNotes,
    };
  },
);

export const selectOpportunityFormRecord = createSelector(
  opportunitiesQuery.selectNoteFields,
  (fields) =>
    _.chain(fields)
      .keyBy((x) => x.uniqId)
      .mapValues(({ value }) => value)
      .value(),
);
