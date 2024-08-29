import { managersQuery } from '@app/client/managers/state';
import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { tagsFeature } from '@app/client/tags/state';
import { createSelector } from '@ngrx/store';

export const selectUpdatingManager = createSelector(
  selectQueryParam(DialogUtil.queryParams.updateManager),
  managersQuery.selectEntities,
  (id, entities) => {
    return entities[id!];
  },
);

export const selectUpdateManagerViewModel = createSelector(
  selectQueryParam(DialogUtil.queryParams.updateManager),
  managersQuery.selectLoadingStates,
  selectUpdatingManager,
  tagsFeature.selectIndustryTags,
  (id, { update: isUpdating, get: isLoading }, manager, industryTags) => {
    return {
      id: id!,
      isUpdating,
      manager,
      isLoading,
      industryTags,
    };
  },
);
