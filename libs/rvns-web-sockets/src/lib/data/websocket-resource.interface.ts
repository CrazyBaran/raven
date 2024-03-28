type Prefix<P extends string, S extends string> = `${P}${S}`;

export const websocketResources = ['notes', 'pipelines', 'shortlists'] as const;

export type WebsocketResourceType = (typeof websocketResources)[number];

export type WebsocketResource = Prefix<'resource-', WebsocketResourceType>;
