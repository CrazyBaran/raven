import {
  AffinityEmailInteractionDto,
  AffinityMeetingInteractionDto,
} from './interaction.affinity.dto';

export class BasePaginatedAffinityInteractionsDto {
  public next_page_token?: string;
}

export class PaginatedAffinityEmailInteractionsDto extends BasePaginatedAffinityInteractionsDto {
  public emails: AffinityEmailInteractionDto[];
}

export class PaginatedAffinityEventInteractionsDto extends BasePaginatedAffinityInteractionsDto {
  public events: AffinityMeetingInteractionDto[];
}

export type PaginatedAffinityInteractionDto =
  | PaginatedAffinityEmailInteractionsDto
  | PaginatedAffinityEventInteractionsDto;
