import { EntityDto } from './entity.dto';
import { EntityType } from './list-type.dto';

export class ListEntryDto {
  public id: number;
  public list_id: number;
  public creator_id: number;
  public entity_id: number;
  public created_at: string;
  public entity_type: EntityType;
  public entity: EntityDto;
}
