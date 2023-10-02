import { ListEntryResponseDto } from './list-entry-response.dto';

export class PaginatedListEntriesDto {
  public list_entries: ListEntryResponseDto[];
  public next_page_token: string;
}
