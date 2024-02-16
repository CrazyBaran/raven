import { CompanyDwhEntity } from './v1/entities/company.dwh.entity';

export const DataWarehouseDataSourceName = 'dataWarehouse';

export const DWH_SERVICE = 'DWH_SERVICE';

export const DWH_CACHE = {
  COMPANIES: 'DataWarehouseCompanyCache',
  FOUNDERS: 'DataWarehouseFoundersCache',
  INVESTORS: 'DataWarehouseInvestorsCache',
  LAST_UPDATED: 'DataWarehouseLastUpdatedCache',
  FORCED_REGENERATION: 'DataWarehouseForcedRegenerationCache',
  LAST_CHECKED: 'DataWarehouseLastCheckedCache',
  NEWEST_ENTRY_DATE: 'DataWarehouseNewestEntryDateCache',
  INDUSTRIES: 'DataWarehouseIndustriesCache',
};

export const DWH_QUEUE = {
  NAME: 'DataWarehouseQueue',
  JOBS: {
    REGENERATE: 'DataWarehouseQueue-Regenerate',
    REGENERATE_STATIC: 'DataWarehouseQueue-RegenerateStatic',
  },
};

export const DWH_COMPANY_SELECT_COLUMNS: Partial<keyof CompanyDwhEntity>[] = [
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
