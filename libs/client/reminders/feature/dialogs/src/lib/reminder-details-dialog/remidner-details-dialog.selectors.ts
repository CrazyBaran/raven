import { remindersQuery } from '@app/client/reminders/state';
import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';
import { MOCK_REMINDER } from '../update-reminder-form.token';

export const selectReminderDetails = createSelector(
  selectQueryParam(DialogUtil.queryParams.reminderDetails),
  remindersQuery.selectEntities,
  (id, entities) => {
    return entities[id!];
  },
);

export const selectCreateReminderViewModel = createSelector(
  remindersQuery.selectLoadingStates,
  selectQueryParam(DialogUtil.queryParams.reminderDetails),
  selectReminderDetails,
  ({ get: isLoading }, reminderId, reminder) => {
    return {
      isLoading,
      reminderId: reminderId!,
      reminder: MOCK_REMINDER,
    };
  },
);
