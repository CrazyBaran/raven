import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { OrganisationEntity } from '../rvn-opportunities/entities/organisation.entity';
import { OrganisationTagEntity, TagEntity } from './entities/tag.entity';

@Injectable()
export class OrganisationTagSyncService implements OnModuleInit {
  public constructor(
    @InjectRepository(OrganisationEntity)
    private readonly organisationRepository: Repository<OrganisationEntity>,
    @InjectRepository(OrganisationTagEntity)
    private readonly tagsRepository: Repository<OrganisationTagEntity>,
    private readonly logger: RavenLogger,
  ) {
    this.logger.setContext(OrganisationTagSyncService.name);
  }

  public async onModuleInit(): Promise<void> {
    await this.ensureTagsForOrganisations();
  }

  private async ensureTagsForOrganisations(): Promise<void> {
    const organisationsWithoutTags = await this.organisationRepository
      .createQueryBuilder('organisation')
      .leftJoinAndSelect(
        'organisation.organisationDomains',
        'organisationDomains',
      )
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
    // if (organisationsWithoutTags.length > 0) {
    //   await this.tagsRepository.manager.transaction(async (tem) => {
    //     for (const organisation of organisationsWithoutTags) {
    //       const tag = new OrganisationTagEntity();
    //       tag.name = `${organisation.name} (${organisation.domains[0]})`;
    //       tag.type = TagTypeEnum.Company;
    //       tag.organisationId = organisation.id;
    //       await tem.save(tag);
    //     }
    //   });
    // } todo disbaled for now
    this.logger.log(
      `${organisationsWithoutTags.length} organisation tags created`,
    );
  }
}
