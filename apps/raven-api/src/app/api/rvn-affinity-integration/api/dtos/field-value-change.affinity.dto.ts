import { AffinityActionType } from './action-type.affinity.dto';
import { AffinityFieldValueEntityDto } from './field-value-entity.affinity.dto';
import { AffinityPersonDto } from './person.affinity.dto';

export class AffinityFieldValueChangeDto {
  public id: number;
  public field_id: number;
  public entity_id: number;
  public list_entry_id: number;
  public action_type: AffinityActionType;
  public changer: AffinityPersonDto;
  public changed_at: string;
  public value: AffinityFieldValueEntityDto;
}
