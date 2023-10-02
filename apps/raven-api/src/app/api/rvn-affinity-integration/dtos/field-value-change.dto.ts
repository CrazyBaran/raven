import { ActionType } from './action-type.dto';
import { PersonDto } from './person.dto';
import { FieldValueEntityDto } from './field-value-entity.dto';

export class FieldValueChangeDto {
  public id: number;
  public field_id: number;
  public entity_id: number;
  public list_entry_id: number;
  public action_type: ActionType;
  public changer: PersonDto;
  public changed_at: string;
  public value: FieldValueEntityDto;
}
