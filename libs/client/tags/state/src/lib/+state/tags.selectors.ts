import { authQuery } from '@app/client/core/auth';
import { createSelector } from '@ngrx/store';
import { tagsFeature } from './tags.reducer';

export const selectCurrentUserTag = createSelector(
  authQuery.selectUserName,
  tagsFeature.selectPeopleTags,
  (name, tags) => tags.find((t) => t.name === name),
);

export const tagsQuery = {
  selectCurrentUserTag,
  tagsFeature,
};
