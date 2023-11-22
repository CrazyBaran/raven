export interface CreateTagData {
  readonly name: string;
  readonly type: string;
  readonly domain?: string;
  readonly userId?: string;
  readonly organisationId?: string;
}
