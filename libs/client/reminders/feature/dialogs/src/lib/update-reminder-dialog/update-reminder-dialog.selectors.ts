import { remindersQuery } from '@app/client/reminders/state';
import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { tagsQuery } from '@app/client/tags/state';
import { createSelector } from '@ngrx/store';
import { MOCK_REMINDER } from '../update-reminder-form.token';

export const selectUpdatingReminder = createSelector(
  selectQueryParam(DialogUtil.queryParams.updateReminder),
  remindersQuery.selectEntities,
  (id, entities) => {
    return entities[id!] ?? MOCK_REMINDER;
  },
);

export const selectUpdateReminderViewModel = createSelector(
  selectQueryParam(DialogUtil.queryParams.updateReminder),
  remindersQuery.selectLoadingStates,
  selectUpdatingReminder,
  tagsQuery.tagsFeature.selectOpportunityTags,
  tagsQuery.selectCurrentUserTag,
  (id, { update: isUpdating }, reminder, opportunityTags, currentUser) => {
    return {
      id: id!,
      isUpdating,
      reminder,
      opportunityTags,
      currentUser,
    };
  },
);
