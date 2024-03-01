import { remindersQuery } from '@app/client/reminders/state';
import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

export const selectDeleteReminderViewModel = createSelector(
  selectQueryParam(DialogUtil.queryParams.deleteReminder),
  remindersQuery.selectLoadingStates,
  (id, { delete: isDeleting }) => {
    return {
      id: id!,
      isDeleting: !!isDeleting,
    };
  },
);
