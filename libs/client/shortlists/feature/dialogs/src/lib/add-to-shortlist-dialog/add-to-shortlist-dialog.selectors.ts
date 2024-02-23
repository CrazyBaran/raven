import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { shortlistsQuery } from '@app/client/shortlists/state';
import { createSelector } from '@ngrx/store';

export const selectAddToShortlistViewModel = createSelector(
  selectQueryParam(DialogUtil.queryParams.addToShortlist),
  shortlistsQuery.selectAll,
  shortlistsQuery.selectLoadingStates,
  (
    list,
    shortlists,
    { table: isLoadingData, bulkAdd: isUpdating, create: isCreating },
  ) => {
    return {
      isUpdating,
      isCreating,
      isLoadingData,
      organisations: (Array.isArray(list) ? list : [list]) as string[],
      shortlists: shortlists,
    };
  },
);
