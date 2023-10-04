import { EntityDto } from './entity.dto';

export class ListEntryResponseDto {
  public id: number;
  public list_id: number;
  public creator_id: number;
  public entity_id: number;
  public created_at: string;
  public entity: EntityDto;
}
