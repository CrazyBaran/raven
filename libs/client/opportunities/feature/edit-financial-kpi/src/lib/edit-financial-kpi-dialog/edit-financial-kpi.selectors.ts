import { notesQuery } from '@app/client/notes/data-access';
import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import {
  DynamicControl,
  DynamicGroupControl,
} from '@app/client/shared/dynamic-form-util';
import { routerQuery } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

export const selectFinancialNoteFields = createSelector(
  routerQuery.selectActiveTab,
  opportunitiesQuery.selectFinancialGroups,
  (tab, notes) => notes.filter((x) => x.tabName === tab),
);

export const selectEditFinancialDynamicControls = createSelector(
  selectFinancialNoteFields,
  (financialNoteGroupFields) =>
    _.chain(financialNoteGroupFields)
      .map(
        (group): DynamicGroupControl => ({
          ...group,
          type: 'group',
          controls: _.chain(group.noteFields)
            .map(
              (control): DynamicControl => ({
                ...control,
                type: 'numeric',
                value: control.value,
              }),
            )
            .mapKeys(({ id }) => id)
            .value(),
        }),
      )
      .mapKeys(({ id }) => id)
      .value(),
);

export const selectCreateOpportunityDialogViewModel = createSelector(
  notesQuery.selectNoteUpdateIsLoading,
  notesQuery.selectOpportunityNotes,
  routerQuery.selectCurrentOpportunityId,
  (isLoading, opportunityNotes, opportunityId) => ({
    isUpdating: isLoading,
    opportunityNote: opportunityNotes?.[0],
    opportunityId,
  }),
);
