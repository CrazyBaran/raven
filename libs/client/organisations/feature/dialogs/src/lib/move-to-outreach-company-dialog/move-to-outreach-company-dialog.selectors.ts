import { opportunitiesFeature } from '@app/client/opportunities/data-access';
import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

export const selectCreateOpportunityDialogViewModel = createSelector(
  selectQueryParam(DialogUtil.queryParams.moveToOutreachCompany),
  opportunitiesFeature.selectCreate,
  (id, { isLoading }) => {
    return {
      organisationId: id,
      isLoading,
    };
  },
);
