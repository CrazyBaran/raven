import { ShortlistDto } from '@app/client/shortlists/data-access';

export type ShortlistEntity = Omit<ShortlistDto, 'type'> & {
  type: ShortlistDto['type'] | 'main' | 'my';
};
