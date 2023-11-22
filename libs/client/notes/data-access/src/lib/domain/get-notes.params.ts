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
] as const;

export type NoteQueryParam = (typeof notesQueries)[number];

export type NoteQueryParams = Record<NoteQueryParam, string>;

export const NOTES_QUERY_DEFAULTS: NoteQueryParams = {
  take: '15',
  skip: '0',
  query: '',
  field: 'updatedAt',
  dir: 'desc',
  tagIds: '',
  opportunityId: '',
  organisationId: '',
  noteType: '',
};
