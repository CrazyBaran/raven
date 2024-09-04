import { managersQuery } from '@app/client/managers/state';
import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

export const selectUpdatingContact = createSelector(
  managersQuery.selectCurrentContact,
  (contact) => contact,
);

export const selectUpdateContactViewModel = createSelector(
  selectQueryParam(DialogUtil.queryParams.updateManagerContact),
  managersQuery.selectLoadingStates,
  selectUpdatingContact,
  (id, { updateContact: isUpdating, getContact: isLoading }, contact) => {
    return {
      id: id!,
      isUpdating,
      contact,
      isLoading,
    };
  },
);
