import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { TagEntity } from '../entities/tag.entity';

export class ParseTagPipe extends AbstractEntityPipe<TagEntity> {
  public readonly entityClass = TagEntity;
  public readonly resource = 'tag';
}
