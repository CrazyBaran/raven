import {
  CompanyDto,
  DataWarehouseCompanyOrderBy,
} from '@app/shared/data-warehouse';

export abstract class DataWarehouseAccessBase {
  public abstract getLastUpdated(): Promise<{
    lastUpdated: Date;
    specter: Date;
    dealRoom: Date;
  }>;

  public abstract getCompanies(options?: {
    orderBy?: DataWarehouseCompanyOrderBy;
    direction?: 'ASC' | 'DESC';
    skip?: number;
    take?: number;
    domains?: string[];
  }): Promise<Partial<CompanyDto>[]>;

  public abstract getCount(): Promise<number>;

  public abstract getIndustries(
    progressCallback?: (progress: number) => Promise<void>,
  ): Promise<string[]>;

  public abstract getInvestors(
    progressCallback?: (progress: number) => Promise<void>,
  ): Promise<string[]>;
}
