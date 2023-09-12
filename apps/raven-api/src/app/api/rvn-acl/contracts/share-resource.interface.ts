import { Share } from './share.interface';

export interface ShareResource {
  readonly id: string;
  readonly shares: Share[];
}
