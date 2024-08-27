import { OrganisationData } from '@app/rvns-opportunities';
import { FundManagerRelationStrength, PagedData } from 'rvns-shared';
import { TagData } from '../../../../rvns-tags/src';

export interface PagedFundManagerData extends PagedData<FundManagerData> {}

export interface KeyRelationship {
  id: string;
  name: string;
}

export interface FundManagerData {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly strategy: string;
  readonly geography: string;
  readonly avgCheckSize: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly keyRelationships: KeyRelationship[];
  readonly organisations: OrganisationData[];
  readonly industryTags: TagData[];
  readonly relationStrength: FundManagerRelationStrength;
}
