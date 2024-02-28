import { ShortlistData } from '@app/rvns-shortlists';

export type ShortlistDto = ShortlistData;

export interface GetShortlistDto {
  query?: string;
  skip?: string | number;
  take?: string | number;
  sort?: string;
  dir?: string;
  organisationId?: string;
}
