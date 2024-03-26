import { filesQuery } from '@app/client/files/feature/state';
import { buildPageParamsSelector } from '@app/client/shared/util-router';
import { tagsQuery } from '@app/client/tags/state';
import { createSelector } from '@ngrx/store';
const opportunityFilesQueryParams = ['tag'] as const;

export const selectOrganisationsTableParams = buildPageParamsSelector(
  opportunityFilesQueryParams,
);
export const selectUpdateFileTagsDialogViewModel = createSelector(
  filesQuery.selectLoadingStates,
  tagsQuery.selectTabTags,
  ({ updateTags: isLoading }, tabTags) => {
    return {
      tabTags,
      isLoading,
    };
  },
);
