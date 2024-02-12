import { opportunitiesFeature } from '@app/client/opportunities/data-access';
import { DialogQueryParams } from '@app/client/shared/shelf';
import { selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

export const selectCreateOpportunityDialogViewModel = createSelector(
  selectQueryParam(DialogQueryParams.moveToOutreachCompany),
  opportunitiesFeature.selectCreate,
  (id, { isLoading }) => {
    return {
      organisationId: id,
      isLoading,
    };
  },
);
