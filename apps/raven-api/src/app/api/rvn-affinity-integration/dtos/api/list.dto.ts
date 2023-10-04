import { EntityType } from './list-type.dto';

export class ListDto {
  public id: number;
  public type: EntityType;
  public name: string;
  public public: boolean;
  public owner_id: number;
  public list_size: number;
}
