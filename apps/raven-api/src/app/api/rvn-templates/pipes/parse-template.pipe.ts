import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { TemplateEntity } from '../entities/template.entity';

export class ParseTemplatePipe extends AbstractEntityPipe<TemplateEntity> {
  public readonly entityClass = TemplateEntity;
  public readonly resource = 'template';
}
