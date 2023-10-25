import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TagTypeEnum } from '@app/rvns-tags';
import { Repository } from 'typeorm';
import { OrganisationEntity } from '../rvn-opportunities/entities/organisation.entity';
import { OrganisationTagEntity, TagEntity } from './entities/tag.entity';
import { OrganisationTagSyncServiceLogger } from './organisation-tag-sync-service.logger';

@Injectable()
export class OrganisationTagSyncService implements OnModuleInit {
  public constructor(
    @InjectRepository(OrganisationEntity)
    private readonly organisationRepository: Repository<OrganisationEntity>,
    @InjectRepository(OrganisationTagEntity)
    private readonly tagsRepository: Repository<OrganisationTagEntity>,
    private readonly logger: OrganisationTagSyncServiceLogger,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.ensureTagsForOrganisations();
  }

  private async ensureTagsForOrganisations(): Promise<void> {
    const organisationsWithoutTags = await this.organisationRepository
      .createQueryBuilder('organisation')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from(TagEntity, 'tag')
          .where('tag.organisation_id = organisation.id')
          .getQuery();
        return 'NOT EXISTS ' + subQuery;
      })
      .getMany();

    this.logger.log(
      `Found ${organisationsWithoutTags.length} organisations without tags`,
    );
    if (organisationsWithoutTags.length > 0) {
      await this.tagsRepository.manager.transaction(async (tem) => {
        for (const organisation of organisationsWithoutTags) {
          const tag = new OrganisationTagEntity();
          tag.name = `${organisation.name} (${organisation.domains[0]})`;
          tag.type = TagTypeEnum.Company;
          tag.organisationId = organisation.id;
          await tem.save(tag);
        }
      });
    }
    this.logger.log(
      `${organisationsWithoutTags.length} organisation tags created`,
    );
  }
}