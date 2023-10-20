import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { TagEntity } from '../../rvn-tags/entities/tag.entity';

export class ParseOptionalTagPipe extends AbstractEntityPipe<TagEntity> {
  public readonly entityClass = TagEntity;
  public readonly resource = 'tag';
  public readonly optional = true;
}
