export interface BulkRemoveFromShortlistDto {
  readonly shortlistId: string;

  readonly organisations: string[];
}
