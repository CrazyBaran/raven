/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { authQuery } from '@app/client/core/auth';
import { createSelector } from '@ngrx/store';
import { TagEntity } from './tags.model';
import { tagsFeature } from './tags.reducer';

/**
 * Select tag by logged users name
 */
export const selectCurrentUserTag = createSelector(
  authQuery.selectUserName,
  tagsFeature.selectPeopleTags,
  (name, tags) => tags.find((t) => t.name === name),
);

export const selectIsLoadingTags = (tagType: TagEntity['type']) =>
  createSelector(
    tagsFeature.selectLoadingTags,
    (loadingTags) => loadingTags[tagType],
  );

export const selectTagById = (id: string | undefined) =>
  createSelector(tagsFeature.selectEntities, (tags) =>
    id ? tags[id] : undefined,
  );

export const selectTagsByOrganisationId = (organisationId: string) =>
  createSelector(tagsFeature.selectEntities, (tags) =>
    Object.values(tags).filter((tag) => tag?.organisationId === organisationId),
  );

export const tagsQuery = {
  selectCurrentUserTag,
  tagsFeature,
  selectIsLoadingTags,
  selectTagById,
  selectTagsByOrganisationId,
  ...tagsFeature,
};
