import { OrganisationData } from '@app/rvns-opportunities';
import { TagData } from '@app/rvns-tags';
import { Currency, FundManagerRelationStrength, PagedData } from 'rvns-shared';

export interface PagedFundManagerData extends PagedData<FundManagerData> {}

export interface KeyRelationship {
  id: string;
  name: string;
}

export interface FundManagerData {
  readonly id: string;
  readonly name: string;
  readonly domain: string;
  readonly description: string;
  readonly strategy: string;
  readonly geography: string;
  readonly avgCheckSize: number;
  readonly avgCheckSizeCurrency: Currency;
  readonly aum: number;
  readonly aumCurrency: Currency;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly keyRelationships: KeyRelationship[];
  readonly organisations: OrganisationData[];
  readonly industryTags: TagData[];
  readonly relationStrength: FundManagerRelationStrength;
  readonly isPortfolio: boolean;
}
