import { CompanyV1DwhEntity } from './entities/company.v1.dwh.entity';

export const DWH_V1_SCHEMA = {
  schemaName: 'Raven',
  views: {
    companies: {
      name: 'Companies',
    },
    companyTags: {
      name: 'DealRoomCompanyTags',
    },
    numberOfEmployees: {
      name: 'DealRoomCompanyNumberOfEmployees',
    },
    fundingRounds: {
      name: 'DealRoomFundingRounds',
    },
    investors: {
      name: 'Investors',
    },
    founders: {
      name: 'Founders',
    },
  },
};

export const DWH_V1_COMPANY_SELECT_COLUMNS: Partial<
  keyof CompanyV1DwhEntity
>[] = [
  'name',
  'specterFounders',
  'specterInvestors',
  'companyId',
  'dealRoomLastUpdated',
  'description',
  'domain',
  'totalFundingAmount',
  'lastFundingAmount',
  'lastFundingDate',
  'specterLastFundingType',
  'specterHqLocation',
  'specterHqRegion',
  'specterIndustry',
  'city',
  'country',
  'mcvLeadScore',
  'dealRoomLastFundingRound',
];
