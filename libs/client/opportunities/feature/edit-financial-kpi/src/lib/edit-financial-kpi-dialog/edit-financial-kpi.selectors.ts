import { notesQuery } from '@app/client/notes/data-access';
import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import { routerQuery, selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

export const selectFinancialNoteFields = createSelector(
  routerQuery.selectActiveTab,
  opportunitiesQuery.selectFinancialGroups,
  (tab, notes) => notes.filter((x) => x.tabName === tab),
);

export const selectCreateOpportunityDialogViewModel = createSelector(
  selectFinancialNoteFields,
  notesQuery.selectNoteUpdateIsLoading,
  selectQueryParam('opportunity-create'),
  notesQuery.selectOpportunityNotes,
  routerQuery.selectCurrentOpportunityId,
  (
    fieldGroups,
    isLoading,
    organisationId,
    opportunityNotes,
    opportunityId,
  ) => ({
    fieldGroups,
    isCreating: isLoading,
    organisationId,
    opportunityNote: opportunityNotes?.[0],
    opportunityId,
  }),
);
