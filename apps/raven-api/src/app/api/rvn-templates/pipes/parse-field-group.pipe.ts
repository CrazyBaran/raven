import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { TemplateEntity } from '../entities/template.entity';
import { FieldGroupEntity } from '../entities/field-group.entity';

export class ParseFieldGroupPipe extends AbstractEntityPipe<TemplateEntity> {
  public readonly entityClass = FieldGroupEntity;
  public readonly resource = 'field-group';
  public readonly relations = ['template'];
}
