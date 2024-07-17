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
    return {
      isLoading,
      reminderId: reminderId!,
      reminder,
      companyOpportunityLabel:
        ReminderUtils.getReminderCompanyOpportunityLabel(reminder),
      organisationId: ReminderUtils.getReminderOrganisationId(reminder),
    };
  },
);
