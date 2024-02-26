import { ShortlistData } from '@app/rvns-shortlists';

export type ShortlistDto = ShortlistData & {
  contibutors?: {
    id: string;
    name: string;
  }[];
};

export interface GetShortlistDto {
  query?: string;
  skip?: string | number;
  take?: string | number;
  sort?: string;
  dir?: string;
  organisationId?: string;
}
