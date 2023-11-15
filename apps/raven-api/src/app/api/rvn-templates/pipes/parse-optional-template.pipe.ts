import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { TemplateEntity } from '../entities/template.entity';

export class ParseOptionalTemplatePipe extends AbstractEntityPipe<TemplateEntity> {
  public readonly entityClass = TemplateEntity;
  public readonly resource = 'template';
  public readonly optional = true;
}
