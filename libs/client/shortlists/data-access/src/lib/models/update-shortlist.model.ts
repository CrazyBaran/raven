import { ShortlistDto } from './shortlist.model';

export type UpdateShortlistDto = Partial<
  Pick<ShortlistDto, 'name' | 'description'>
>;
