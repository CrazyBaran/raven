export const DataWarehouseDataSourceName = 'dataWarehouse';

export const DWH_SERVICE = 'DWH_SERVICE';

export const DWH_CACHE = {
  COMPANIES: 'DataWarehouseCompanyCache',
  FOUNDERS: 'DataWarehouseFoundersCache',
  INVESTORS: 'DataWarehouseInvestorsCache',
  LAST_UPDATED: 'DataWarehouseLastUpdatedCache',
  FORCED_REGENERATION: 'DataWarehouseForcedRegenerationCache',
};

export const DWH_QUEUE = {
  NAME: 'DataWarehouseQueue',
  JOBS: {
    REGENERATE: 'DataWarehouseQueue-Regenerate',
  },
};
