import { remindersQuery } from '@app/client/reminders/state';
import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { tagsQuery } from '@app/client/tags/state';
import { createSelector } from '@ngrx/store';

export const selectUpdatingReminder = createSelector(
  selectQueryParam(DialogUtil.queryParams.updateReminder),
  remindersQuery.selectEntities,
  (id, entities) => {
    return entities[id!];
  },
);

export const selectUpdateReminderViewModel = createSelector(
  selectQueryParam(DialogUtil.queryParams.updateReminder),
  remindersQuery.selectLoadingStates,
  selectUpdatingReminder,
  tagsQuery.selectOpportunityTags,
  tagsQuery.selectVersionTags,
  tagsQuery.selectCurrentUserTag,
  (
    id,
    { update: isUpdating },
    reminder,
    opportunityTags,
    versionTags,
    currentUser,
  ) => {
    return {
      id: id!,
      isUpdating,
      reminder,
      opportunityTags,
      versionTags,
      currentUser: {
        id: currentUser?.userId ?? '',
        name: currentUser?.name ?? '',
      },
    };
  },
);
