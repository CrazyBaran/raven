import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { shortlistsQuery } from '@app/client/shortlists/state';
import { createSelector } from '@ngrx/store';

export const selectDeleteShortlistViewModel = createSelector(
  selectQueryParam(DialogUtil.queryParams.deleteShortlist),
  shortlistsQuery.selectLoadingStates,
  (id, { delete: isDeleting }) => {
    return {
      id: id!,
      isDeleting: !!isDeleting,
    };
  },
);
