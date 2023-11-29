export const notesQueries = [
  'take',
  'skip',
  'query',
  'dir',
  'field',
  'tagIds',
  'opportunityId',
  'organisationId',
  'noteType',
  'role',
] as const;

export type NoteQueryParam = (typeof notesQueries)[number];

export type NoteQueryParams = Record<NoteQueryParam, string>;
