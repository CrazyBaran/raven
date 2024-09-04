import { managersQuery } from '@app/client/managers/state';
import { routerQuery } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

export const selectCreateContactViewModel = createSelector(
  routerQuery.selectCurrentId,
  managersQuery.selectLoadingStates,
  (id, { createContact: isCreating }) => {
    return {
      id,
      isCreating,
    };
  },
);
