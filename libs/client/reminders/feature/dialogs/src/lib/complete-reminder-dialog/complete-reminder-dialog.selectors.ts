import { remindersQuery } from '@app/client/reminders/state';
import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

export const selectCompleteReminderViewModel = createSelector(
  selectQueryParam(DialogUtil.queryParams.completeReminder),
  remindersQuery.selectLoadingStates,
  (id, { complete: isCompleting }) => {
    return {
      ids: Array.isArray(id) ? (id as string[]) : [id!],
      isCompleting: !!isCompleting,
    };
  },
);
