import { AffinityEntityDto } from './entity.affinity.dto';
import { AffinityEntityType } from './list-type.affinity.dto';

export class AffinityListEntryDto {
  public id: number;
  public list_id: number;
  public creator_id: number;
  public entity_id: number;
  public created_at: string;
  public entity_type: AffinityEntityType;
  public entity: AffinityEntityDto;
}
