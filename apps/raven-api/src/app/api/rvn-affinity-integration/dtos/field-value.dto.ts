import { FieldValueEntityDto } from './field-value-entity.dto';

export class FieldValueDto {
  public id: number;
  public field_id: number;
  public list_entry_id: number | null;
  public entity_id: number;
  public created_at: string;
  public updated_at: string | null;
  public value: FieldValueEntityDto;
}
