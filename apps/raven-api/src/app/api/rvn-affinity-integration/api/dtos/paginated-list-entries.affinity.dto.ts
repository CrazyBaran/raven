import { AffinityListEntryDto } from './list-entry.affinity.dto';

export class PaginatedAffinityListEntriesDto {
  public list_entries: AffinityListEntryDto[];
  public next_page_token: string;
}
