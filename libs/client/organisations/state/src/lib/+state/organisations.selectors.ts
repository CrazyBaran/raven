import { buildPageParamsSelector } from '@app/client/shared/util-router';
import { organisationsFeature } from './organisations.reducer';

export const organisationsQueryParams = [
  'query',
  'status',
  'my',
  'round',
  'member',
  'skip',
  'take',
  'field',
  'dir',
  'filters',
  'shortlistId',
] as const;

export const selectOrganisationsTableParams = buildPageParamsSelector(
  organisationsQueryParams,
  {
    skip: '0',
    take: '25',
  },
);

export const organisationsQuery = {
  selectOrganisationsTableParams,
  ...organisationsFeature,
};
