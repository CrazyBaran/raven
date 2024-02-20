import { DialogQueryParams } from '@app/client/shared/shelf';
import { selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

export const selectCreateShortlistViewModel = createSelector(
  selectQueryParam(DialogQueryParams.createShortlist),
  (id) => {
    return {
      organisationId: id,
    };
  },
);
