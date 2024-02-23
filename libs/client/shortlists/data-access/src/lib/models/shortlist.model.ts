import { ShortlistData } from '@app/rvns-shortlists';

export type ShortlistDto = ShortlistData & {
  contibutors?: {
    id: string;
    name: string;
  }[];
};

export interface GetShortlistDto {
  query?: string;
  offset?: string | number;
  take?: string | number;
  sort?: string;
  dir?: string;
}
