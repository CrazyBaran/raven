import { PagedData, PagedDataWithExtras, ShortlistType } from 'rvns-shared';

export interface PagedShortlistData extends PagedData<ShortlistData> {}
export interface PagedShortlistDataWithExtras
  extends PagedDataWithExtras<ShortlistData> {}

export interface ShortlistStats {
  organisationsCount: number;
  inPipelineCount: number;
}

export interface ShortlistContributor {
  id: string;
  name: string;
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
  readonly contributors: ShortlistContributor[];
}
