import { EntityManager, In } from 'typeorm';

import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import { TagEntity } from '../../api/rvn-tags/entities/tag.entity';

@Injectable()
export class ParseTagsPipe
  implements PipeTransform<string[], Promise<TagEntity[]>>
{
  @Inject(EntityManager)
  protected entityManager: EntityManager;

  public async transform(
    tagIds: string[] | string | null,
  ): Promise<TagEntity[]> {
    if (!tagIds) {
      return [];
    }
    if (typeof tagIds === 'string') {
      tagIds = tagIds.split(',');
    }
    if (tagIds.length === 0) {
      return [];
    }
    return await this.entityManager.find(TagEntity, {
      where: { id: In(tagIds) },
    });
  }
}
