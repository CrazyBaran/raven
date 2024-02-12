import {
  DataWarehouseLastUpdated,
  Organisation,
} from '@app/client/organisations/data-access';
import { CompanyStatus } from 'rvns-shared';

export type OrganisationEntity = Organisation;

export type DataWarehouseLastUpdatedEntity = DataWarehouseLastUpdated;

export const organisationStatusColorDictionary: Record<CompanyStatus, string> =
  {
    [CompanyStatus.MET]: 'var(--series-e)',
    [CompanyStatus.LIVE_OPPORTUNITY]: 'var(--series-h)',
    [CompanyStatus.PASSED]: 'var(--rv-light)',
    [CompanyStatus.OUTREACH]: 'var(--series-d)',
    [CompanyStatus.PORTFOLIO]: 'var(--rv-primary)',
  };
