//TODO: fix opportunity note typings
/* eslint-disable @typescript-eslint/no-explicit-any */

import { notesQuery } from '@app/client/opportunities/api-notes';
import {
  opportunitiesQuery,
  selectFinancialGroups,
  selectIsTeamMemberForCurrentOpportunity,
} from '@app/client/opportunities/data-access';
import { routerQuery } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

import { Heat, NoteHeatmap } from '@app/client/opportunities/ui';
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
  selectNoteFields,
  selectFinancialGroups,
  notesQuery.selectOpportunityNotesIsLoading,
  routerQuery.selectCurrentOpportunityId,
  selectIsTeamMemberForCurrentOpportunity,
  (
    tab,
    opportunityNotes,
    fields,
    financialGroups,
    isLoading,
    opportunityId,
    isMember,
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
      heatMap: {
        fields: financialGroups
          .filter((x) => x.tabName === tab)
          .map((g) => ({
            uniqId: g.uniqId,
            title: g.title,
            noteFields: g.noteFields.map((f) => ({
              uniqId: f.uniqId,
              title: f.title,
              value: f.value,
              heat: f.heat as Heat,
              unit: f.name,
            })),
          })),
      } as NoteHeatmap,
      fields: tabFields,
      fieldValues: _.chain(tabFields)
        .mapKeys(({ id }) => id)
        .mapValues(({ value }) => value)
        .value(),
      opportunityNote: opportunityNotes[0],
      opportunityNoteId: opportunityNotes[0]?.id,
      isLoading,
      opportunityId,
      canEditFields: isMember,
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
