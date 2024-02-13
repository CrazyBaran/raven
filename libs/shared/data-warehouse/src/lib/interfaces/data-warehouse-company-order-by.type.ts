export type DataWarehouseCompanyOrderBy =
  | 'name'
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'funding.totalFundingAmount'
  | 'funding.lastFundingAmount'
  | 'funding.lastFundingDate'
  | 'funding.lastFundingType'
  | 'funding.lastFundingRound'
  | 'hq.country'
  | 'mcvLeadScore';
