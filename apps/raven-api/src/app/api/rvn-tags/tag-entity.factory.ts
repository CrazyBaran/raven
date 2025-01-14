import { TagTypeEnum } from '@app/rvns-tags';
import {
  OrganisationTagEntity,
  PeopleTagEntity,
  TabTagEntity,
  TagEntity,
  VersionTagEntity,
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
        tag = new OrganisationTagEntity();
        tag.organisationId = options.organisationId;
        break;
      case TagTypeEnum.People:
        tag = new PeopleTagEntity();
        tag.userId = options.userId;
        break;
      case TagTypeEnum.Tab:
        tag = new TabTagEntity();
        tag.tabId = options.tabId;
        break;
      case TagTypeEnum.General:
      case TagTypeEnum.BusinessModel:
      case TagTypeEnum.Industry:
      case TagTypeEnum.Opportunity:
        tag = new TagEntity();
        break;
      case TagTypeEnum.Version:
        tag = new VersionTagEntity();
        tag.organisationId = options.organisationId;
        break;
      default:
        throw new Error('Unsupported tag type');
    }
    tag.name = options.name;
    tag.type = options.type;
    return tag;
  }
}
