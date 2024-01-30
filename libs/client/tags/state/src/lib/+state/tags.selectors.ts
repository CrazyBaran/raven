import { authQuery } from '@app/client/core/auth';
import { createSelector } from '@ngrx/store';
import { TagEntity } from './tags.model';
import { tagsFeature } from './tags.reducer';

export const selectCurrentUserTag = createSelector(
  authQuery.selectUserName,
  tagsFeature.selectPeopleTags,
  (name, tags) => tags.find((t) => t.name === name),
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectIsLoadingTags = (tagType: TagEntity['type']) =>
  createSelector(
    tagsFeature.selectLoadingTags,
    (loadingTags) => loadingTags[tagType],
  );

export const tagsQuery = {
  selectCurrentUserTag,
  tagsFeature,
  selectIsLoadingTags,
};
