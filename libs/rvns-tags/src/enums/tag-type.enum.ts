export const tagTypes = [
  'general',
  'people',
  'company',
  'industry',
  'opportunity',
  'investor',
  'business-model',
] as const;

export type TagType = (typeof tagTypes)[number];

export enum TagTypeEnum {
  General = 'general',
  People = 'people',
  Company = 'company',
  Industry = 'industry',
  Opportunity = 'opportunity',
  Investor = 'investor',
  BusinessModel = 'business-model',
}