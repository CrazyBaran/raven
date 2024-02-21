import { PagedData, ShortlistType } from 'rvns-shared';

export interface PagedShortlistData extends PagedData<ShortlistData> {}

export interface ShortlistStats {
  organisationsCount: number;
  inPipelineCount: number;
}

export interface ShortlistData {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly type: ShortlistType;
  readonly creatorId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly stats: ShortlistStats;
}
