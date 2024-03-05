import { buildPageParamsSelector } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';
import { remindersFeature } from './reminders.reducer';

const remindersQueryParams = [
  'query',
  'status',
  'skip',
  'take',
  'field',
  'dir',
  'assignee',
  'status',
] as const;

const selectRemindersTableParams = buildPageParamsSelector(
  remindersQueryParams,
  {
    skip: '0',
    take: '25',
  },
);

const selectReloadTableParams = createSelector(
  remindersFeature.selectTable,
  selectRemindersTableParams,
  (table, params) => {
    return {
      ...params,
      skip: '0',
      take: table.ids.length.toString(),
    };
  },
);

const selectToMeCount = createSelector(
  remindersFeature.selectTable,

  (table) => {
    return 21;
  },
);

const selectToOthersCount = createSelector(
  remindersFeature.selectTable,
  (table) => {
    return 37;
  },
);

const selectTotalCount = createSelector(
  selectToMeCount,
  selectToOthersCount,
  (my, other) => my + other,
);

export const remindersQuery = {
  ...remindersFeature,
  remindersQueryParams,
  selectRemindersTableParams,
  selectReloadTableParams,
  selectToMeCount,
  selectToOthersCount,
  selectTotalCount,
};
