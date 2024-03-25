import { AffinityListEntryDto } from './list-entry.affinity.dto';
import { AffinityEntityType } from './list-type.affinity.dto';

export class AffinityOpportunityDto {
  public id: number;
  public type: AffinityEntityType.Opportunity;
  public name: string;
  public person_ids: number[];
  public organization_ids: number[];
  public list_entries: AffinityListEntryDto[];
}
