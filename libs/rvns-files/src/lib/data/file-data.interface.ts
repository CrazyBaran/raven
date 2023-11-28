import { TagData } from '@app/rvns-tags';

export interface FileData {
  readonly id: string;
  readonly internalSharepointId: string;
  readonly opportunityId: string;
  readonly tags: TagData[];
}
