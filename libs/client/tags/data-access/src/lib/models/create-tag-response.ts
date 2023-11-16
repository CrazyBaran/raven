import { TagType } from '@app/rvns-tags';

export interface CreateTagResponse {
  readonly id: string;
  readonly name: string;
  readonly type: TagType;
}
