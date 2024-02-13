import { CompanyFilterOptions } from '@app/shared/data-warehouse';

export type Direction = 'ASC' | 'DESC';

export const sortableFields = [
  'name',
  'id',
  'funding.totalFundingAmount',
  'funding.lastFundingAmount',
  'funding.lastFundingDate',
  'funding.lastFundingType',
  'hq.country',
] as const;
export type SortableField = (typeof sortableFields)[number];

export type PrimaryDataSource = 'raven' | 'dwh'; //  | 'affinity';

export class GetOrganisationsOptions {
  public skip?: number;
  public take?: number;
  public direction?: Direction;
  public orderBy?: SortableField;
  public query?: string;
  public member?: string;
  public round?: string;
  public primaryDataSource?: PrimaryDataSource;
  public filters?: CompanyFilterOptions;
}

export const defaultGetOrganisationsOptions: GetOrganisationsOptions = {
  skip: 0,
  take: 15,
  direction: 'ASC',
  orderBy: 'name',
  primaryDataSource: 'raven',
};
