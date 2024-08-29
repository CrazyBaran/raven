import { FundManagerRelationStrength } from 'rvns-shared';

export interface GetManagersDto {
  query?: string;
  skip?: string | number;
  take?: string | number;
  sort?: string;
  dir?: string;
}

export const RelationStrengthName: Record<string, string> = {
  [FundManagerRelationStrength.PORTFOLIO]: 'Tier I - Portfolio',
  [FundManagerRelationStrength.CLOSE_PARTNER]: 'Tier I - Close Partner',
  [FundManagerRelationStrength.NETWORK]: 'Tier II - Network',
  [FundManagerRelationStrength.NO_RELATIONSHIP]: 'Tier III - No Relationship',
};

export const RelationStrengthColor: Record<string, string> = {
  [FundManagerRelationStrength.PORTFOLIO]: '#12861E',
  [FundManagerRelationStrength.CLOSE_PARTNER]: '#81CF89',
  [FundManagerRelationStrength.NETWORK]: '#FFBF1F',
  [FundManagerRelationStrength.NO_RELATIONSHIP]: '#8F8F8F',
};

export const RelationshipStrengthData = [
  {
    name: RelationStrengthName[FundManagerRelationStrength.PORTFOLIO],
    id: FundManagerRelationStrength.PORTFOLIO,
  },
  {
    name: RelationStrengthName[FundManagerRelationStrength.CLOSE_PARTNER],
    id: FundManagerRelationStrength.CLOSE_PARTNER,
  },
  {
    name: RelationStrengthName[FundManagerRelationStrength.NETWORK],
    id: FundManagerRelationStrength.NETWORK,
  },
  {
    name: RelationStrengthName[FundManagerRelationStrength.NO_RELATIONSHIP],
    id: FundManagerRelationStrength.NO_RELATIONSHIP,
  },
];

export const GeographyData = [
  'North America',
  'Latam',
  'Asia ex-China',
  'China',
  'MENA',
  'Africa',
  'Oceania',
];

export const CurrencyData = ['USD', 'GBP', 'EUR', 'AED'];
