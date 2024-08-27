import {
  CompanyDto,
  ContactDto,
  DataWarehouseCompanyOrderBy,
  FundingRoundDto,
  NewsDto,
  NumberOfEmployeesSnapshotDto,
} from '@app/shared/data-warehouse';
import { PagedData } from 'rvns-shared';
import { InvestmentV2DwhEntity } from '../v2/entities/investment.v2.dwh.entity';
import { InvestorV2DwhEntity } from '../v2/entities/investor.v2.dwh.entity';

export abstract class DataWarehouseAccessBase {
  public abstract getLastUpdated(): Promise<{
    lastUpdated: Date;
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

  public abstract getFundManagers(): Promise<InvestorV2DwhEntity[]>;

  public abstract getFundManagerInvestments(
    fundDomain: string,
  ): Promise<[InvestmentV2DwhEntity[], number]>;

  public abstract findAndMapContacts(
    domains: string[],
    skip?: number,
    take?: number,
  ): Promise<PagedData<Partial<ContactDto>>>;

  public abstract findAndMapEmployees(
    domains: string[],
    skip?: number,
    take?: number,
  ): Promise<PagedData<Partial<NumberOfEmployeesSnapshotDto>>>;

  public abstract findAndMapFundingRounds(
    domains: string[],
    skip?: number,
    take?: number,
  ): Promise<PagedData<Partial<FundingRoundDto>>>;

  public abstract findAndMapNews(
    domains: string[],
    skip?: number,
    take?: number,
  ): Promise<PagedData<Partial<NewsDto>>>;
}
