import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { FieldDefinitionEntity } from '../entities/field-definition.entity';

export class ParseFieldDefinitionPipe extends AbstractEntityPipe<FieldDefinitionEntity> {
  public readonly entityClass = FieldDefinitionEntity;
  public readonly resource = 'field-definition';
  public readonly relations = ['group', 'hideOnPipelineStages'];
}
