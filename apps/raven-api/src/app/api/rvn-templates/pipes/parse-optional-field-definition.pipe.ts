import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { FieldDefinitionEntity } from '../entities/field-definition.entity';

export class ParseOptionalFieldDefinitionPipe extends AbstractEntityPipe<FieldDefinitionEntity> {
  public readonly entityClass = FieldDefinitionEntity;
  public readonly resource = 'field-definition';
  public readonly optional = true;
}
