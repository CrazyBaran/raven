export interface TagData {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly userId?: string;
  readonly organisationId?: string;
  readonly tabId?: string;
  readonly domain?: string;
}
