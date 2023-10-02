import { FieldValueEntityDto } from './field-value-entity.dto';

export class CreateFieldValueDto {
  public field_id: number;
  public value: FieldValueEntityDto;
  public entity_id: number;
}
