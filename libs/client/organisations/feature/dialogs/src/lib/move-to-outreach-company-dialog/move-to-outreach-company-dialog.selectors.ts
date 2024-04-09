import { opportunitiesFeature } from '@app/client/opportunities/data-access';
import { organisationsQuery } from '@app/client/organisations/state';
import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

export const selectCreateOpportunityDialogViewModel = createSelector(
  selectQueryParam(DialogUtil.queryParams.moveToOutreachCompany),
  opportunitiesFeature.selectCreate,
  organisationsQuery.selectCurrentOrganisation,
  (id, { isLoading }, currentOrganisation) => {
    return {
      organisationId: id,
      companyStatus: currentOrganisation?.companyStatus,
      isLoading,
    };
  },
);
