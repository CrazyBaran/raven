import { organisationsQuery } from '@app/client/organisations/state';
import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

export const selectUpdateOrganisationDescriptionViewModel = createSelector(
  selectQueryParam(DialogUtil.queryParams.updateOrganisationDescription),
  organisationsQuery.selectCurrentOrganisation,
  organisationsQuery.selectLoadingStates,
  (organisationId, organisation, { updateDescription: isUpdating }) => {
    return {
      isUpdating,
      organisationId: organisationId,
      organisation: organisation,
    };
  },
);
