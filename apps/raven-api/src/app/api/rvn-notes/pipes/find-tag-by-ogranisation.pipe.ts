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
    PipeTransform<OrganisationEntity | null, Promise<OrganisationTagEntity>>
{
  @InjectRepository(TagEntity)
  protected readonly tagRepository: Repository<OrganisationTagEntity>;

  public async transform(
    organisationEntity: OrganisationEntity | null,
  ): Promise<OrganisationTagEntity | null> {
    if (!organisationEntity) {
      return null;
    }
    const tags = await this.tagRepository.find({
      where: {
        organisationId: organisationEntity.id,
        type: In([TagTypeEnum.Company, TagTypeEnum.Investor]),
      },
    });

    const tag = tags.filter(
      (tag) => (tag as VersionTagEntity).opportunityTagId === null,
    );

    // TODO: we should return array of tags and handle all of them
    if (tag.length > 0) {
      return tag[0];
    }

    return null;
  }
}
