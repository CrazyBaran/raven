export type Direction = 'ASC' | 'DESC';

export const sortableFields = ['name', 'description'] as const;
export type SortableField = (typeof sortableFields)[number];

export class GetShortlistsOptions {
  public skip?: number;
  public take?: number;
  public direction?: Direction;
  public orderBy?: SortableField;
  public query?: string;
  public organisationId?: string;
}

export const defaultGetShortlistsOptions: GetShortlistsOptions = {
  skip: 0,
  take: 25,
  direction: 'ASC',
  orderBy: 'name',
};
