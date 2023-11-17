export const organisationsQueryParams = [
  'query',
  'my',
  'opportunity',
  'lead',
  'skip',
  'take',
  'field',
  'dir',
] as const;

export type OrganisationQueryParam = (typeof organisationsQueryParams)[number];
export type OrganisationQueryParams = Partial<
  Record<OrganisationQueryParam, string>
>;

export const defaultOrganisationQuery: OrganisationQueryParams = {
  skip: '0',
  take: '15',
};

export const organisationTableNavigationButtons = [
  {
    id: null,
    name: 'All deals',
  },
  {
    id: 'true',
    name: 'My deals',
  },
];
