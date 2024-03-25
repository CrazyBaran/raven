import { AffinityFieldValueEntityDto } from './field-value-entity.affinity.dto';

export class AffinityCreateFieldValueDto {
  public field_id: number;
  public value: AffinityFieldValueEntityDto;
  public entity_id: number;
}
