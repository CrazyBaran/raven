export interface TagData {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly userId?: string;
  readonly organisationId?: string;
  readonly fundManagerId?: string;
  readonly tabId?: string;
  readonly domain?: string;
  readonly link?: string[] | null;
  readonly order?: number;
}
