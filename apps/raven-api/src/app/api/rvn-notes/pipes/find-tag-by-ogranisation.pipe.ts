import { Repository } from 'typeorm';

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
      where: { organisationId: organisationEntity.id },
    });

    const tag = tags.filter(
      (tag) => (tag as VersionTagEntity).opportunityTagId === null,
    );

    if (tag.length > 1) {
      throw new Error(
        'More than one tag found for given organisation. Invalid configuration!',
      );
    }
    if (tag.length === 1) {
      return tag[0];
    }
    return null;
  }
}
