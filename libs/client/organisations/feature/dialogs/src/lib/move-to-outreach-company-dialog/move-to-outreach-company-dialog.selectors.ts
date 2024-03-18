import { opportunitiesFeature } from '@app/client/opportunities/data-access';
import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';
import { organisationsFeature } from '../../../../../state/src';

export const selectCreateOpportunityDialogViewModel = createSelector(
  selectQueryParam(DialogUtil.queryParams.moveToOutreachCompany),
  opportunitiesFeature.selectCreate,
  organisationsFeature.selectCurrentOrganisation,
  (id, { isLoading }, currentOrganisation) => {
    return {
      organisationId: id,
      companyStatus: currentOrganisation?.companyStatus,
      isLoading,
    };
  },
);
