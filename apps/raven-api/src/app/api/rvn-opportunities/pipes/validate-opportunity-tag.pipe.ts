import { TagTypeEnum } from '@app/rvns-tags';
import { Injectable, PipeTransform } from '@nestjs/common';
import { TagEntity } from '../../rvn-tags/entities/tag.entity';

@Injectable()
export class ValidateOpportunityTagPipe
  implements PipeTransform<TagEntity | null, Promise<TagEntity | null>>
{
  public async transform(value: TagEntity | null): Promise<TagEntity | null> {
    if (!value) {
      return null;
    }
    if (value.type !== TagTypeEnum.Opportunity) {
      throw new Error(`Tag ${value.name} is not an opportunity tag`);
    }
    return value;
  }
}
