import {
  DataWarehouseLastUpdated,
  Organisation,
} from '@app/client/organisations/data-access';

export type OrganisationEntity = Organisation;

export type DataWarehouseLastUpdatedEntity = DataWarehouseLastUpdated;

export type OrganisationStatus = NonNullable<Organisation['companyStatus']>;

export const organisationStatusColorDictionary: Record<
  OrganisationStatus,
  string
> = {
  met: 'var(--series-e)',
  live_opportunity: 'var(--series-h)',
  passed: 'var(--rv-light)',
  outreach: 'var(--series-d)',
  portfolio: 'var(--rv-primary)',
};
