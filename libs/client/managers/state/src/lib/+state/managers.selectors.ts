import { buildPageParamsSelector } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';
import { managersFeature } from './managers.reducer';

const managersQueryParams = [
  'query',
  'skip',
  'take',
  'field',
  'dir',
  'organisationId',
  'keyRelationship',
  'relationshipStrength',
  'filters',
] as const;

const managersTableParamsOrigin = buildPageParamsSelector(managersQueryParams, {
  skip: '0',
  take: '30',
  field: 'id',
  dir: 'asc',
});

const selectManagersTableParams = createSelector(
  managersTableParamsOrigin,
  (params) => params,
);

const selectReloadTableParams = createSelector(
  managersFeature.selectTable,
  selectManagersTableParams,
  (table, params) => {
    return {
      ...params,
      skip: '0',
      take: table.ids.length.toString(),
    };
  },
);

export const managersQuery = {
  ...managersFeature,
  managersTableParamsOrigin,
  managersQueryParams,
  selectManagersTableParams,
  selectReloadTableParams,
};
