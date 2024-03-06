import { TagTypeEnum } from '@app/rvns-tags';
import {
  OrganisationTagEntity,
  PeopleTagEntity,
  TagEntity,
} from './entities/tag.entity';
import { CreateTagOptions } from './tags.service';

export class TagEntityFactory {
  public static createTag(
    options: CreateTagOptions,
  ): TagEntity | PeopleTagEntity | OrganisationTagEntity {
    let tag;
    switch (options.type) {
      case TagTypeEnum.Company:
      case TagTypeEnum.Investor:
      case TagTypeEnum.Version:
        tag = new OrganisationTagEntity();
        tag.organisationId = options.organisationId;
        break;
      case TagTypeEnum.People:
        tag = new PeopleTagEntity();
        tag.userId = options.userId;
        break;
      case TagTypeEnum.Tab:
        throw new Error('Tab tags are only created by the system');
      case TagTypeEnum.General:
      case TagTypeEnum.BusinessModel:
      case TagTypeEnum.Industry:
      case TagTypeEnum.Opportunity:
        tag = new TagEntity();
        break;
      default:
        throw new Error('Unsupported tag type');
    }
    tag.name = options.name;
    tag.type = options.type;
    return tag;
  }
}
