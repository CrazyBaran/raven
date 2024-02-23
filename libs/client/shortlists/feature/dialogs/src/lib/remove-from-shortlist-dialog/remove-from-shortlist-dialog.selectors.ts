import { DialogUtil } from '@app/client/shared/util';
import {
  selectQueryParam,
  selectRouteParam,
} from '@app/client/shared/util-router';
import { shortlistsQuery } from '@app/client/shortlists/state';
import { createSelector } from '@ngrx/store';

export const selectDeleteShortlistViewModel = createSelector(
  selectQueryParam(DialogUtil.queryParams.removeFromShortlist),
  selectRouteParam('shortlistId'),
  shortlistsQuery.selectLoadingStates,
  (list, id, { bulkRemove: isRemoving }) => {
    return {
      id: id!,
      organisations: (Array.isArray(list) ? list : [list]) as string[],
      isRemoving: !!isRemoving,
    };
  },
);
