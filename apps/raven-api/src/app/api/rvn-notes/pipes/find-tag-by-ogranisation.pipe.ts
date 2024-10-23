import { In, Repository } from 'typeorm';

import { TagTypeEnum } from '@app/rvns-tags';
import { Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganisationEntity } from '../../rvn-opportunities/entities/organisation.entity';
import {
  OrganisationTagEntity,
  TagEntity,
  VersionTagEntity,
} from '../../rvn-tags/entities/tag.entity';

@Injectable()
export class FindTagByOgranisationPipe
  implements
    PipeTransform<
      OrganisationEntity | null,
      Promise<Array<OrganisationTagEntity>>
    >
{
  @InjectRepository(TagEntity)
  protected readonly tagRepository: Repository<OrganisationTagEntity>;

  public async transform(
    organisationEntity: OrganisationEntity | null,
  ): Promise<Array<OrganisationTagEntity> | null> {
    if (!organisationEntity) {
      return null;
    }
    const tags = await this.tagRepository.find({
      where: {
        organisationId: organisationEntity.id,
        type: In([TagTypeEnum.Company, TagTypeEnum.Investor]),
      },
    });

    const filteredTags = tags.filter(
      (tag) => (tag as VersionTagEntity).opportunityTagId === null,
    );

    if (filteredTags.length > 0) {
      return filteredTags;
    }

    return null;
  }
}
