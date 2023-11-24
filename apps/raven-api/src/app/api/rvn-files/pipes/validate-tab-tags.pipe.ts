import { TagTypeEnum } from '@app/rvns-tags';
import { Injectable, PipeTransform } from '@nestjs/common';
import { TagEntity } from '../../rvn-tags/entities/tag.entity';

@Injectable()
export class ValidateTabTagsPipe
  implements PipeTransform<TagEntity[] | null, Promise<TagEntity[] | null>>
{
  public async transform(
    value: TagEntity[] | null,
  ): Promise<TagEntity[] | null> {
    if (!value) {
      return null;
    }
    for (const tag of value) {
      if (tag.type !== TagTypeEnum.Tab) {
        throw new Error(`Tag ${tag.name} is not a tab tag`);
      }
    }
    return value;
  }
}
