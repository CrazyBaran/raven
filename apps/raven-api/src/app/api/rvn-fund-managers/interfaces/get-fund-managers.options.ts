import { FundManagerRelationStrength } from 'rvns-shared';

export type Direction = 'ASC' | 'DESC';

export const sortableFields = ['name', 'description'] as const;
export type SortableField = (typeof sortableFields)[number];

export class GetFundManagersOptions {
  public skip?: number;
  public take?: number;
  public direction?: Direction;
  public orderBy?: SortableField;
  public query?: string;
  public organisationId?: string;
  public name?: string;
  public relationshipStrength?: FundManagerRelationStrength;
  public keyRelationship?: string;
  public filters?: {
    avgCheckSize?: {
      min?: number;
      max?: number;
      currency?: string;
    };
    industryTags?: Array<string>;
    geography?: Array<string>;
  };
}

export const defaultGetFundManagersOptions: GetFundManagersOptions = {
  skip: 0,
  take: 25,
  direction: 'ASC',
  orderBy: 'name',
};
