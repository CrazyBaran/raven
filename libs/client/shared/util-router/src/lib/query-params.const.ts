const ravenQueryParams = ['note-details'] as const;

export type RavenQueryParam = (typeof ravenQueryParams)[number];

export const NOTE_DETAILS_QUERY_PARAM = ravenQueryParams[0];

export const SKIP_QUERY_PARAMS = 'skip';
