import { remindersQuery } from '@app/client/reminders/state';
import { ReminderUtils } from '@app/client/reminders/utils';
import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

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
    const company = ReminderUtils.getReminderCompanyTag(reminder!);
    const opportunity = ReminderUtils.getReminderOpportunityTag(reminder!);
    return {
      isLoading,
      reminderId: reminderId!,
      reminder,
      companyOpportunityLabel: `${company?.name ?? ''} ${
        opportunity?.name ? `/ ${opportunity.name}` : ``
      }`,
    };
  },
);
