import { EntityType } from './list-type.dto';
import { ListEntryResponseDto } from './list-entry-response.dto';

export class OpportunityDto {
  public id: number;
  public type: EntityType.Opportunity;
  public name: string;
  public person_ids: number[];
  public organization_ids: number[];
  public list_entries: ListEntryResponseDto[];
}