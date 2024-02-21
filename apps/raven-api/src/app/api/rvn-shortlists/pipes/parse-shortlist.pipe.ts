import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { ShortlistEntity } from '../entities/shortlist.entity';

export class ParseShortlistPipe extends AbstractEntityPipe<ShortlistEntity> {
  public readonly entityClass = ShortlistEntity;
  public readonly resource = 'shortlist';
  public readonly relations = ['organisations'];
}
