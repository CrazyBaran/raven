import { Injectable } from '@nestjs/common';
import { DataWarehouseCompanyOrderBy } from '../../interfaces/data-warehouse-company-order-by.type';

@Injectable()
export class DataWarehouseOrderByMapper {
  public static map(value: DataWarehouseCompanyOrderBy): string {
    switch (value) {
      case 'name':
        return 'name';
      case 'id':
        return 'id';
      case 'createdAt':
        return 'created_at';
      case 'updatedAt':
        return 'updated_at';
      default:
        throw new Error(`Unknown order by value: ${value}`);
    }
  }
}
