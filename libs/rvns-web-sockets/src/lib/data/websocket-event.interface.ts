export interface WebsocketEvent<T = unknown> {
  eventType: string;
  data: T;
}
