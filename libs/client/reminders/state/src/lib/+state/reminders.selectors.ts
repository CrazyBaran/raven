import { buildPageParamsSelector } from '@app/client/shared/util-router';
import { tagsQuery } from '@app/client/tags/state';
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
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

const remindersTableParamsOrigin = buildPageParamsSelector(
  remindersQueryParams,
  {
    skip: '0',
    take: '30',
  },
);

const selectRemindersTableParams = createSelector(
  remindersTableParamsOrigin,
  tagsQuery.selectCurrentUserTag,
  (params, currentUser) => {
    if (!params.assignee && currentUser) {
      return { ...params, assignee: currentUser.userId! };
    } else {
      return _.omit(params, 'assignee');
    }
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
  remindersFeature.selectRemindersState,

  ({ stats }) => {
    return stats.overdue.forMe;
  },
);

const selectToOthersCount = createSelector(
  remindersFeature.selectRemindersState,

  ({ stats }) => {
    return stats.overdue.forOthers;
  },
);

const selectTotalCount = createSelector(
  selectToMeCount,
  selectToOthersCount,
  (my, other) => my + other,
);

export const remindersQuery = {
  ...remindersFeature,
  remindersTableParamsOrigin,
  remindersQueryParams,
  selectRemindersTableParams,
  selectReloadTableParams,
  selectToMeCount,
  selectToOthersCount,
  selectTotalCount,
};
