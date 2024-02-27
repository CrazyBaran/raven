import { DataWarehouseCompanyOrderBy } from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DataWarehouseOrderByMapper {
  public map(value: DataWarehouseCompanyOrderBy): string {
    switch (value) {
      case 'funding.totalFundingAmount':
        return 'data.fundingTotalFundingAmount';
      case 'funding.lastFundingAmount':
        return 'data.fundingLastFundingAmount';
      case 'funding.lastFundingDate':
        return 'data.fundingLastFundingDate';
      case 'funding.lastFundingType':
        return 'data.fundingLastFundingType';
      case 'funding.lastFundingRound':
        return 'data.fundingLastFundingRound';
      case 'hq.country':
        return 'data.hqCountry';
      case 'mcvLeadScore':
        return 'data.mcvLeadScore';
      case 'name':
      case 'company':
      default:
        return 'organisations.name';
    }
  }
}
