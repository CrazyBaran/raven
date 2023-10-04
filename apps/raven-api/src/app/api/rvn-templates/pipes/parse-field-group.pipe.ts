import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { FieldGroupEntity } from '../entities/field-group.entity';

export class ParseFieldGroupPipe extends AbstractEntityPipe<FieldGroupEntity> {
  public readonly entityClass = FieldGroupEntity;
  public readonly resource = 'field-group';
  public readonly relations = ['template'];
}
