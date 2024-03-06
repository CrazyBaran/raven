import { tagsQuery } from '@app/client/organisations/api-tags';

import { ReminderEntity, remindersQuery } from '@app/client/reminders/state';
import { ReminderTableRow } from '@app/client/reminders/ui';
import { ReminderUtils } from '@app/client/reminders/utils';
import { TableViewModel } from '@app/client/shared/ui-directives';
import { ButtongroupNavigationModel } from '@app/client/shared/ui-router';
import {
  buildButtonGroupNavigation,
  buildInputNavigation,
} from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

export const selectRemindersTableButtonGroupNavigation = createSelector(
  remindersQuery.selectRemindersTableParams,
  tagsQuery.selectCurrentUserTag,
  (params, userTag): ButtongroupNavigationModel => {
    return buildButtonGroupNavigation({
      params,
      name: 'assignee',
      buttons: [
        {
          id: userTag?.userId ?? 'unknown',
          name: 'For Me',
        },
        {
          id: null,
          name: 'For Others',
        },
      ],
    });
  },
);

export const selectRemindersTableButtonGroupNavigation2 = createSelector(
  remindersQuery.selectRemindersTableParams,
  tagsQuery.selectCurrentUserTag,
  (params, userTag): ButtongroupNavigationModel => {
    return buildButtonGroupNavigation({
      params,
      name: 'status',
      buttons: [
        {
          id: null,
          name: 'Incomplete',
        },

        {
          id: 'completed',
          name: 'Completed',
        },
      ],
    });
  },
);

export const selectRemindersTableQueryModel = createSelector(
  remindersQuery.selectRemindersTableParams,
  (params) =>
    buildInputNavigation({
      params,
      name: 'query',
      placeholder: `Search by Reminder's Title`,
    }),
);

export const selectReminderRows = createSelector(
  remindersQuery.selectTable,
  remindersQuery.selectEntities,
  ({ ids }, entities) => {
    const shortlists = ids.map((id) => entities[id]);
    return shortlists.filter((x): x is ReminderEntity => !!x);
  },
);

export const selectTableModel = createSelector(
  remindersQuery.selectRemindersTableParams,
  selectReminderRows,
  remindersQuery.selectLoadingStates,
  remindersQuery.selectTable,
  (
    params,
    rows,
    { table: isLoading, loadMoreTable: isLoadMore, reloadTable },
    { total },
  ): TableViewModel<ReminderTableRow> => ({
    ...params,
    total,
    isLoading: !!isLoading || !!isLoadMore || !!reloadTable,
    data: rows.map((reminder) => ({
      ...reminder,
      assignees: reminder.assignees.map(({ name }) => name),
      tag: {
        company: ReminderUtils.getReminderCompanyTag(reminder)?.name,
        opportunity: ReminderUtils.getReminderOpportunityTag(reminder)?.name,
      },
      actionsModel: ReminderUtils.getReminderActions(reminder),
    })),
  }),
);

export const selectRemindersTableViewModel = createSelector(
  selectRemindersTableButtonGroupNavigation,
  selectRemindersTableButtonGroupNavigation2,
  selectRemindersTableQueryModel,
  selectTableModel,
  remindersQuery.selectToMeCount,
  remindersQuery.selectToOthersCount,
  (
    buttonGroupNavigation,
    buttonGroupNavigation2,
    queryModel,
    tableModel,
    myRemindersCount,
    otherRemindersCount,
  ) => ({
    buttonGroupNavigation,
    buttonGroupNavigation2,
    queryModel,
    tableModel,
    myRemindersCount,
    otherRemindersCount,
  }),
);