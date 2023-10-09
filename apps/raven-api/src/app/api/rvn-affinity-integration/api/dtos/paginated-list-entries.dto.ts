import { ListEntryDto } from './list-entry.dto';

export class PaginatedListEntriesDto {
  public list_entries: ListEntryDto[];
  public next_page_token: string;
}
