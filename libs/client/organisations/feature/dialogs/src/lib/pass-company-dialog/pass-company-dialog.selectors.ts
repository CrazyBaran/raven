import { organisationsFeature } from '@app/client/organisations/state';
import { DialogQueryParams } from '@app/client/shared/shelf';
import { selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

export const selectPassCompanyDialogViewModel = createSelector(
  selectQueryParam(DialogQueryParams.passCompany),
  organisationsFeature.selectEntities,
  organisationsFeature.selectUpdateLoading,
  (id, organisations, isLoading) => {
    return {
      organisationId: id,
      isLoading,
      organisationDisplayName: organisations[id!]?.name,
    };
  },
);
