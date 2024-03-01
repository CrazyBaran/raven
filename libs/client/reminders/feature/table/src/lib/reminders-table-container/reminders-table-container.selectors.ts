import { tagsQuery } from '@app/client/organisations/api-tags';

import { ReminderEntity, remindersQuery } from '@app/client/reminders/state';
import { ReminderTableRow } from '@app/client/reminders/ui';
import { TableViewModel } from '@app/client/shared/ui-directives';
import { ButtongroupNavigationModel } from '@app/client/shared/ui-router';
import { DialogUtil } from '@app/client/shared/util';
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
          id: null,
          name: 'For Others',
        },

        {
          id: userTag?.userId ?? 'unknown',
          name: 'For Me',
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
      assignees: reminder.assignies.map(({ name }) => name),
      tag: {
        company: reminder.company.name,
        opportunity: reminder.opportunity.name,
      },
      assignies: reminder.assignies.map(({ name }) => name),
      actionsModel: {
        actions: [
          {
            text: 'Complete Reminder',
            queryParams: {
              [DialogUtil.queryParams.completeReminder]: reminder.id,
            },
            skipLocationChange: true,
            routerLink: [''],
            queryParamsHandling: 'merge',
          },
          {
            text: 'Update Reminder',
            queryParams: {
              [DialogUtil.queryParams.updateReminder]: reminder.id,
            },
            skipLocationChange: true,
            routerLink: [''],
            queryParamsHandling: 'merge',
          },
          {
            text: 'Delete Reminder',
            queryParams: {
              [DialogUtil.queryParams.deleteReminder]: reminder.id,
            },
            skipLocationChange: true,
            routerLink: [''],
            queryParamsHandling: 'merge',
            actionStyle: { color: 'var(--informational-error)' },
          },
        ],
      },
    })),
  }),
);

export const selectRemindersTableViewModel = createSelector(
  selectRemindersTableButtonGroupNavigation,
  selectRemindersTableButtonGroupNavigation2,
  selectRemindersTableQueryModel,

  selectTableModel,
  (buttonGroupNavigation, buttonGroupNavigation2, queryModel, tableModel) => ({
    buttonGroupNavigation,
    buttonGroupNavigation2,
    queryModel,
    tableModel,
  }),
);
