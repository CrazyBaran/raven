import { TagData, TagType } from '@app/rvns-tags';

export type Tag = Omit<TagData, 'type'> & {
  type: TagType;
};
