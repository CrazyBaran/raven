import { DataWarehouseCompanyOrderBy } from './data-warehouse-company-order-by.type';
import { LastFundingType } from './last-funding-type.type';

export class GetCompaniesOptions {
  public orderBy?: DataWarehouseCompanyOrderBy;
  public direction?: 'ASC' | 'DESC';
  public skip?: number;
  public take?: number;
  public query?: string;
}

export class CompanyFilterOptions {
  public totalFundingAmount?: {
    min?: number;
    max?: number;
  };
  public lastFundingAmount?: {
    min?: number;
    max?: number;
  };
  public lastFundingDate?: {
    min?: Date;
    max?: Date;
  };
  public lastFundingType?: LastFundingType;

  public countries?: string[];

  public mcvLeadScore?: { min?: number; max?: number };
}
