import { managersQuery } from '@app/client/managers/state';
import { selectRouteParam } from '@app/client/shared/util-router';
import { tagsFeature } from '@app/client/tags/state';
import { createSelector } from '@ngrx/store';

export const selectManagerDetails = createSelector(
  selectRouteParam('id'),
  managersQuery.selectEntities,
  (id, entities) => entities[id!],
);

export const selectManagerDetailsViewModel = createSelector(
  managersQuery.selectLoadingStates,
  selectRouteParam('id'),
  selectManagerDetails,
  tagsFeature.selectPeopleTags,
  tagsFeature.selectLoadingTags,
  (
    { get: isLoading, update: isUpdating },
    managerId,
    manager,
    peopleTags,
    loadingTags,
  ) => {
    const peopleData = peopleTags.map((t) => ({
      name: t.name,
      id: t.userId!,
    }));

    return {
      isLoading: !!isLoading,
      isUpdating: !!isUpdating,
      managerId: managerId!,
      manager,
      peopleData,
      peopleDataIsLoading: !!loadingTags.people,
    };
  },
);
