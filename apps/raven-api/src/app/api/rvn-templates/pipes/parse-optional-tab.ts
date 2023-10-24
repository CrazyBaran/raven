import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { TabEntity } from '../entities/tab.entity';

export class ParseOptionalTab extends AbstractEntityPipe<TabEntity> {
  public readonly entityClass = TabEntity;
  public readonly resource = 'tab';
  public readonly optional = true;
}
