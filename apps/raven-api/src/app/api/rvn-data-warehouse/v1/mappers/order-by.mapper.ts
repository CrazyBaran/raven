import { DataWarehouseCompanyOrderBy } from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DataWarehouseOrderByMapper {
  public map(value: DataWarehouseCompanyOrderBy): string {
    switch (value) {
      case 'name':
        return 'name';
      case 'funding.totalFundingAmount':
        return 'totalFundingAmount';
      case 'funding.lastFundingAmount':
        return 'lastFundingAmount';
      case 'funding.lastFundingDate':
        return 'lastFundingDate';
      case 'funding.lastFundingType':
        return 'lastFundingDate';
      default:
        throw new Error(`Unknown order by value: ${value}`);
    }
  }
}
