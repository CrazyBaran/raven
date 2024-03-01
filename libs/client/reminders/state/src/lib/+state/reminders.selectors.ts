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

export const selectReloadTableParams = createSelector(
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

export const remindersQuery = {
  ...remindersFeature,
  remindersQueryParams,
  selectRemindersTableParams,
  selectReloadTableParams,
};
