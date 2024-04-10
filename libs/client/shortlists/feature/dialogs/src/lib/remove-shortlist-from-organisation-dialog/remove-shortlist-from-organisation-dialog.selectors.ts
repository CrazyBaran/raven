import { organisationsQuery } from '@app/client/organisations/state';
import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { shortlistsQuery } from '@app/client/shortlists/state';
import { createSelector } from '@ngrx/store';

export const selectRemoveShortlistFromOrganisationViewModel = createSelector(
  selectQueryParam(DialogUtil.queryParams.removeShortlistFromOrganisation),
  organisationsQuery.selectCurrentOrganisation,
  shortlistsQuery.selectLoadingStates,
  (shortlistId, organisation, { bulkRemove: isRemoving }) => {
    return {
      shortlistId,
      organisationId: organisation!.id,
      isRemoving: !!isRemoving,
    };
  },
);
