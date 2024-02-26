import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { shortlistsQuery } from '@app/client/shortlists/state';
import { createSelector } from '@ngrx/store';
import { ItemDisabledFn } from '@progress/kendo-angular-dropdowns';
import { ItemArgs } from '@progress/kendo-angular-dropdowns/common/disabled-items/item-disabled';

export const selectAddToShortlistViewModel = createSelector(
  selectQueryParam(DialogUtil.queryParams.addToShortlist),
  shortlistsQuery.selectAll,
  shortlistsQuery.selectLoadingStates,
  shortlistsQuery.selectMyShortlist,
  (
    list,
    shortlists,

    { table: isLoadingData, bulkAdd: isUpdating, create: isCreating },
    myShortlist,
  ) => {
    return {
      isUpdating,
      isCreating,
      isLoadingData,
      organisations: (Array.isArray(list) ? list : [list]) as string[],
      shortlists: [myShortlist, ...shortlists],
      itemDisabled: ((context: ItemArgs): boolean =>
        true) satisfies ItemDisabledFn,
      myShortlist,
    };
  },
);
