import { managersQuery } from '@app/client/managers/state';
import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

export const selectRemoveContactViewModel = createSelector(
  selectQueryParam(DialogUtil.queryParams.removeManagerContact),
  managersQuery.selectLoadingStates,
  (id, { deleteContact: isRemoving }) => {
    return {
      id,
      isRemoving: !!isRemoving,
    };
  },
);
