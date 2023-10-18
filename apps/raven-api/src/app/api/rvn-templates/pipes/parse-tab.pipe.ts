import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { TabEntity } from '../entities/tab.entity';

export class ParseTabPipe extends AbstractEntityPipe<TabEntity> {
  public readonly entityClass = TabEntity;
  public readonly resource = 'tab';
}
