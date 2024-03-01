import { remindersQuery } from '@app/client/reminders/state';
import { tagsQuery } from '@app/client/tags/state';
import { createSelector } from '@ngrx/store';

export const selectCreateReminderViewModel = createSelector(
  remindersQuery.selectLoadingStates,
  tagsQuery.tagsFeature.selectOpportunityTags,
  tagsQuery.selectCurrentUserTag,
  ({ create: isCreating }, opportunityTags, currentUser) => {
    return {
      isCreating,
      opportunityTags,
      currentUser,
    };
  },
);
