import { CompanyV2DwhEntity } from './entities/company.v2.dwh.entity';

export const DWH_V2_SCHEMA = {
  schemaName: 'Raven',
  views: {
    companies: {
      name: 'Companies',
    },
  },
};

export const DWH_V2_COMPANY_SELECT_COLUMNS: Partial<
  keyof CompanyV2DwhEntity
>[] = [
  'name',
  'domain',
  'description',
  'country',
  'industries',
  'investors',
  'totalFundingAmount',
  'lastFundingAmount',
  'lastFundingDate',
  'lastFundingRound',
  'mcvLeadScore',
  'specterLastUpdated',
  'dealRoomLastUpdated',
  'lastRefreshedUtc',
];
