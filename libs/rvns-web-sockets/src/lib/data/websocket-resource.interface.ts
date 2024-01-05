export const websocketResources = [
  'resource-notes',
  'resource-pipelines',
] as const;

export type WebsocketResource = (typeof websocketResources)[number];
