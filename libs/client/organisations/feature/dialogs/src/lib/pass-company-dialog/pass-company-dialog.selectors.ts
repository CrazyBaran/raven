import { organisationsFeature } from '@app/client/organisations/state';
import { DialogQueryParams } from '@app/client/shared/shelf';
import { selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

export const selectCreateOpportunityDialogViewModel = createSelector(
  selectQueryParam(DialogQueryParams.passCompany),
  organisationsFeature.selectUpdateLoading,
  (id, isLoading) => {
    return {
      organisationId: id,
      isLoading,
    };
  },
);
