/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { authQuery } from '@app/client/core/auth';
import { routerQuery } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';
import { TagEntity } from './tags.model';
import { tagsFeature } from './tags.reducer';

/**
 * Select tag by logged users name
 */
export const selectCurrentUserTag = createSelector(
  authQuery.selectUserId,
  tagsFeature.selectPeopleTags,
  (id, tags) => tags.find((t) => t.userId === id),
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

export const selectTagsByOrganisationDictionary = createSelector(
  tagsFeature.selectEntities,
  (tags) =>
    Object.values(tags).reduce(
      (acc, tag) => {
        if (tag?.organisationId) {
          acc[tag.organisationId] = [...(acc[tag.organisationId] || []), tag];
        }
        return acc;
      },
      {} as Record<string, TagEntity[]>,
    ),
);

export const selectCurrentOrganisationTags = createSelector(
  routerQuery.selectCurrentOrganisationId,
  selectTagsByOrganisationDictionary,
  (organisationId, tagsDictionary) => tagsDictionary[organisationId!],
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
  selectTagsByOrganisationDictionary,
  selectCurrentOrganisationTags,
  ...tagsFeature,
};
