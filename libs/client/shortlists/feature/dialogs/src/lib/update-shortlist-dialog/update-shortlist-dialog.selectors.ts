import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { shortlistsQuery } from '@app/client/shortlists/state';
import { createSelector } from '@ngrx/store';

export const selectUpdatingShortlist = createSelector(
  selectQueryParam(DialogUtil.queryParams.updateShortlist),
  shortlistsQuery.selectEntities,
  (id, entities) => {
    return entities[id!];
  },
);

export const selectUpdateShortlistViewModel = createSelector(
  selectQueryParam(DialogUtil.queryParams.updateShortlist),
  shortlistsQuery.selectLoadingStates,
  selectUpdatingShortlist,

  (id, { update: isUpdating }, currentShortlist) => {
    return {
      id: id!,
      isUpdating,
      currentShortlist,
    };
  },
);
