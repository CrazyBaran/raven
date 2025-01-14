import { organisationsFeature } from '@app/client/organisations/state';
import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

export const selectPassCompanyDialogViewModel = createSelector(
  selectQueryParam(DialogUtil.queryParams.passCompany),
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
