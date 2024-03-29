import {
  OrganisationData,
  OrganisationDataWithOpportunities,
  PagedOrganisationData,
} from '@app/rvns-opportunities';
import { Injectable, Optional } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { InteractionsDto } from '@app/shared/affinity';
import {
  CompanyDto,
  ContactDto,
  FundingRoundDto,
  NewsDto,
  NumberOfEmployeesSnapshotDto,
} from '@app/shared/data-warehouse';
import { JobPro } from '@taskforcesh/bullmq-pro';
import { CompanyStatus, PagedData } from 'rvns-shared';
import { EntityManager, In, Repository } from 'typeorm';
import { environment } from '../../../environments/environment';
import { SharepointDirectoryStructureGenerator } from '../../shared/sharepoint-directory-structure.generator';
import { AffinityService } from '../rvn-affinity-integration/affinity.service';
import { AffinityCacheService } from '../rvn-affinity-integration/cache/affinity-cache.service';
import { AffinityEnricher } from '../rvn-affinity-integration/cache/affinity.enricher';
import { OrganizationStageDto } from '../rvn-affinity-integration/dtos/organisation-stage.dto';
import { DataWarehouseCacheService } from '../rvn-data-warehouse/cache/data-warehouse-cache.service';
import { DataWarehouseEnricher } from '../rvn-data-warehouse/cache/data-warehouse.enricher';
import { DataWarehouseService } from '../rvn-data-warehouse/data-warehouse.service';
import { OrganisationProvider } from '../rvn-data-warehouse/proxy/organisation.provider';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { PipelineUtilityService } from '../rvn-pipeline/pipeline-utility.service';
import { TagEntity } from '../rvn-tags/entities/tag.entity';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { DomainResolver } from '../rvn-utils/domain.resolver';
import { OpportunityEntity } from './entities/opportunity.entity';
import { OrganisationDomainEntity } from './entities/organisation-domain.entity';
import { OrganisationEntity } from './entities/organisation.entity';
import { OrganisationCreatedEvent } from './events/organisation-created.event';
import {
  GetOrganisationsOptions,
  PrimaryDataSource,
} from './interfaces/get-organisations.options';
import { OpportunityTeamService } from './opportunity-team.service';
import { OrganisationHelperService } from './organisation-helper.service';

interface CreateOrganisationOptions {
  initialDataSource?: PrimaryDataSource;
  name: string;
  domain: string;
  createOpportunity?: boolean;
}

interface UpdateOrganisationOptions {
  name?: string;
  customDescription?: string;
  domains?: string[];
  companyStatus?: CompanyStatus | null;
}

@Injectable()
export class OrganisationService {
  public constructor(
    private readonly logger: RavenLogger,
    private readonly eventEmitter: EventEmitter2,
    private readonly opportunityTeamService: OpportunityTeamService,
    @InjectRepository(OrganisationEntity)
    private readonly organisationRepository: Repository<OrganisationEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
    private readonly affinityCacheService: AffinityCacheService,
    private readonly affinityEnricher: AffinityEnricher,
    @Optional() private readonly dataWarehouseEnricher: DataWarehouseEnricher,
    @Optional()
    private readonly dataWarehouseCacheService: DataWarehouseCacheService,
    private readonly domainResolver: DomainResolver,
    private readonly pipelineUtilityService: PipelineUtilityService,
    private readonly organisationProvider: OrganisationProvider,
    private readonly organisationHelperService: OrganisationHelperService,
    @Optional()
    private readonly dataWarehouseService: DataWarehouseService,
    private readonly affinityService: AffinityService,
  ) {
    this.logger.setContext(OrganisationService.name);
  }

  public async findAll(
    options?: GetOrganisationsOptions,
  ): Promise<PagedOrganisationData> {
    if (!options) {
      throw new Error('Options are required');
    }

    const { organisationIds, count } =
      await this.organisationProvider.getOrganisations(
        options,
        options?.filters,
      );

    const queryBuilder =
      this.organisationRepository.createQueryBuilder('organisations');

    queryBuilder
      .leftJoinAndSelect('organisations.opportunities', 'opportunities')
      .leftJoinAndSelect('opportunities.pipelineStage', 'pipelineStage')
      .leftJoinAndSelect('opportunities.tag', 'tag')
      .leftJoinAndSelect('opportunities.shares', 'shares')
      .leftJoinAndSelect('shares.actor', 'member')
      .leftJoinAndSelect(
        'opportunities.pipelineDefinition',
        'pipelineDefinition',
      )
      .leftJoinAndSelect(
        'organisations.organisationDomains',
        'organisationDomains',
      )
      .leftJoin('organisations.shortlists', 'shortlists')
      .addSelect(['shortlists.id', 'shortlists.name']);

    if (organisationIds.length === 0) {
      return {
        items: [],
        total: 0,
      };
    }
    queryBuilder.where(`organisations.id IN (:...organisationIds)`, {
      organisationIds,
    });

    const organisations = await queryBuilder.getMany();

    const teamsForOpportunities =
      await this.opportunityTeamService.getOpportunitiesTeams(
        (organisations as unknown as OrganisationDataWithOpportunities[])
          .map((org) => org.opportunities)
          .flat() as unknown as OpportunityEntity[],
      );

    const affinityEnrichedData =
      await this.affinityEnricher.enrichOrganisations(
        organisations,
        async (entity, data) => {
          this.sortOpportunities(data);

          for (const opportunity of data.opportunities) {
            const pipelineStage =
              await this.pipelineUtilityService.getPipelineStageOrDefault(
                opportunity.stage.id,
              );

            opportunity.stage = {
              ...opportunity.stage,
              displayName: pipelineStage.displayName,
              order: pipelineStage.order,
              mappedFrom: pipelineStage.mappedFrom,
              relatedCompanyStatus: pipelineStage.relatedCompanyStatus,
            };

            opportunity.team = teamsForOpportunities[opportunity.id];
          }

          data.companyStatus = this.evaluateCompanyStatus(entity, data);
          data.shortlists = entity.shortlists
            ?.slice(0, 25)
            ?.map((shortlist) => ({ id: shortlist.id, name: shortlist.name }));

          return data;
        },
      );

    const enrichedData = this.dataWarehouseEnricher
      ? await this.dataWarehouseEnricher?.enrichOrganisations(
          affinityEnrichedData,
        )
      : affinityEnrichedData;

    return {
      items: enrichedData.sort((a, b) => {
        const lowestIndexA = organisationIds.indexOf(a.id);
        const lowestIndexB = organisationIds.indexOf(b.id);
        return lowestIndexA - lowestIndexB;
      }),
      total: count,
    } as PagedOrganisationData;
  }

  public async findOne(id: string): Promise<OrganisationDataWithOpportunities> {
    const organisation = await this.organisationRepository.findOne({
      where: { id },
      relations: [
        'opportunities',
        'opportunities.pipelineStage',
        'opportunities.pipelineDefinition',
        'opportunities.tag',
        'organisationDomains',
      ],
    });

    const teamsForOpportunities =
      await this.opportunityTeamService.getOpportunitiesTeams(
        (organisation as unknown as OrganisationDataWithOpportunities)
          .opportunities as unknown as OpportunityEntity[],
      );

    const affinityEnrichedOrganisation =
      await this.affinityEnricher.enrichOrganisation(
        organisation,
        async (entity, data) => {
          this.sortOpportunities(data);

          for (const opportunity of data.opportunities) {
            const pipelineStage =
              await this.pipelineUtilityService.getPipelineStageOrDefault(
                opportunity.stage.id,
              );

            opportunity.stage = {
              ...opportunity.stage,
              displayName: pipelineStage.displayName,
              order: pipelineStage.order,
              mappedFrom: pipelineStage.mappedFrom,
              relatedCompanyStatus: pipelineStage.relatedCompanyStatus,
            };

            opportunity.team = teamsForOpportunities[opportunity.id];
          }
          data.sharepointDirectory =
            SharepointDirectoryStructureGenerator.getDirectoryForSharepointEnabledEntity(
              organisation,
            );
          data.sharePointPath = `${
            environment.sharePoint.rootDirectory
          }/${SharepointDirectoryStructureGenerator.getDirectoryNameForOrganisation(
            organisation,
          )}`;
          data.companyStatus = this.evaluateCompanyStatus(entity, data);

          return data;
        },
      );

    return this.dataWarehouseEnricher
      ? await this.dataWarehouseEnricher?.enrichOrganisation(
          affinityEnrichedOrganisation,
        )
      : affinityEnrichedOrganisation;
  }

  public async findByDomain(domain: string): Promise<OrganisationEntity[]> {
    const cleanedDomains = this.domainResolver.extractDomains(domain);
    const organisations = await this.organisationRepository.find({
      relations: ['organisationDomains'],
      where: { organisationDomains: { domain: In(cleanedDomains) } },
    });

    return organisations;
  }

  public async create(
    options: CreateOrganisationOptions,
  ): Promise<OrganisationEntity> {
    const existingOrganisation = await this.getExistingByDomains(
      this.domainResolver.extractDomains(options.domain),
    );

    if (existingOrganisation) {
      return existingOrganisation;
    }

    return await this.organisationRepository.manager.transaction(
      async (tem) => {
        const organisation = new OrganisationEntity();
        organisation.name = options.name;
        organisation.initialDataSource = options.initialDataSource;

        const organisationEntity = await tem.save(organisation);

        const cleanedDomains = this.domainResolver.extractDomains(
          options.domain,
        );
        for (const singleDomain of cleanedDomains) {
          const organisationDomain = new OrganisationDomainEntity();
          organisationDomain.organisation = organisationEntity;
          organisationDomain.organisationId = organisationEntity.id;
          organisationDomain.domain = singleDomain;
          await tem.save(organisationDomain);
        }

        const organisationEntityReloaded = await tem.findOne(
          OrganisationEntity,
          {
            where: { id: organisationEntity.id },
            relations: ['organisationDomains'],
          },
        );

        this.eventEmitter.emit(
          'organisation-created',
          new OrganisationCreatedEvent(organisationEntityReloaded),
        );

        if (options.createOpportunity) {
          const organizationStageDtos =
            await this.affinityCacheService.getByDomains(cleanedDomains);

          await this.createOpportunityForOrganisation(
            organisationEntityReloaded,
            organizationStageDtos[0].stage?.text || null,
            tem,
          );
        }
        return organisationEntity;
      },
    );
  }

  public async update(
    organisation: OrganisationEntity,
    options: UpdateOrganisationOptions,
    user?: UserEntity,
  ): Promise<OrganisationEntity> {
    if (options.name) {
      organisation.name = options.name;
    }
    if (options.customDescription != undefined) {
      organisation.customDescription = options.customDescription;
      organisation.customDescriptionUpdatedAt = new Date();
    }
    if (options.domains) {
      await this.updateDomains(organisation, options.domains);
    }

    const overridingCompanyStatus = Object.prototype.hasOwnProperty.call(
      options,
      'companyStatus',
    );
    if (overridingCompanyStatus) {
      organisation.companyStatusOverride = options.companyStatus;

      if (options.companyStatus === CompanyStatus.PASSED) {
        await this.organisationHelperService.handleCompanyPassed(
          organisation,
          user,
        );
      }
    }

    delete organisation.organisationDomains;
    await this.organisationRepository.save(organisation);

    const updatedOrganisation = await this.organisationRepository.findOne({
      where: { id: organisation.id },
      relations: ['organisationDomains'],
    });

    updatedOrganisation.companyStatusOverride = overridingCompanyStatus
      ? options.companyStatus
      : undefined;

    return updatedOrganisation;
  }

  public async remove(id: string): Promise<void> {
    const queryBuilder = this.tagRepository.createQueryBuilder('tags');
    queryBuilder.where('tags.organisationId = :id', { id });

    const tags = await queryBuilder.getMany();

    await this.tagRepository.remove(tags);

    await this.organisationRepository.delete(id);
  }

  public async removeMany(ids: string[]): Promise<void> {
    const chunkSize = 1000;

    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunk = ids.slice(i, i + chunkSize);
      const queryBuilder = this.tagRepository.createQueryBuilder('tags');
      queryBuilder.where('tags.organisationId IN (:...chunk)', { chunk });

      const tags = await queryBuilder.getMany();

      await this.tagRepository.remove(tags);

      await this.organisationRepository.delete(chunk);
    }
  }

  public async ensureAllAffinityOrganisationsAsOrganisations(): Promise<void> {
    const affinityData = await this.affinityCacheService.getAll();
    const existingOrganisations = await this.organisationRepository.find({
      relations: ['organisationDomains'],
    });
    const nonExistentAffinityData = this.getNonExistentAffinityData(
      affinityData,
      existingOrganisations,
    );

    this.logger.log(
      `Found ${nonExistentAffinityData.length} non-existent organisations`,
    );
    for (const organisation of nonExistentAffinityData) {
      await this.createFromAffinity(organisation);
    }
    this.logger.log(`Found non-existent organisations synced`);
  }

  public async ensureAllDataWarehouseOrganisationsAsOrganisations(
    job: JobPro,
  ): Promise<void> {
    const dataWarehouseCompanyCount =
      await this.dataWarehouseCacheService.getCompanyCount();

    const dataWarehouseCompanyKeys =
      await this.dataWarehouseCacheService.getCompanyKeys();
    const step = 500;
    for (let i = 0; i < dataWarehouseCompanyCount; i += step) {
      const pagedKeys = dataWarehouseCompanyKeys.slice(i, i + step);

      const dataWarehouseData =
        await this.dataWarehouseCacheService.getCompanies(pagedKeys);

      const sortedDataWarehouseData = dataWarehouseData.sort((a, b) =>
        a.domain.localeCompare(b.domain),
      );

      const domains = sortedDataWarehouseData.map((company) => company.domain);

      const existingOrganisations = await this.organisationRepository.find({
        relations: ['organisationDomains'],
        where: { organisationDomains: { domain: In(domains) } },
      });

      const nonExistentDataWarehouseData = this.getNonExistentDataWarehouseData(
        sortedDataWarehouseData,
        existingOrganisations,
      );

      for (const organisation of nonExistentDataWarehouseData) {
        await this.createFromDataWarehouse(organisation);
      }

      this.logger.log(
        `Found ${nonExistentDataWarehouseData.length} non-existent organisations`,
      );

      await job.updateProgress(
        Math.round((i / dataWarehouseCompanyCount) * 100),
      );
    }

    await this.eventEmitter.emitAsync(
      'data-warehouse.regeneration.organisations.finished',
    );
  }

  public getNonExistentDataWarehouseData(
    dataWarehouseData: CompanyDto[],
    existingOrganisations: OrganisationEntity[],
  ): CompanyDto[] {
    return dataWarehouseData.filter((company) => {
      return !existingOrganisations.some((opportunity) => {
        return opportunity.domains.some((domain) => {
          return company.domain === domain;
        });
      });
    });
  }

  public getNonExistentAffinityData(
    affinityData: OrganizationStageDto[],
    existingOrganisations: OrganisationEntity[],
  ): OrganizationStageDto[] {
    return affinityData.filter((affinity) => {
      return !existingOrganisations.some((organisation) => {
        return organisation.domains.some((domain) => {
          if (affinity?.organizationDto?.domains?.length === 0) return true;
          return affinity.organizationDto.domains.includes(domain);
        });
      });
    });
  }

  public async createFromAffinity(
    organisationstageDto: OrganizationStageDto,
  ): Promise<OrganisationEntity> {
    const organisationDto = organisationstageDto.organizationDto;
    return await this.organisationRepository.manager.transaction(
      async (tem) => {
        const organisation = new OrganisationEntity();
        organisation.name = organisationDto.name;
        organisation.initialDataSource = 'affinity';
        const savedOrganisation = await tem.save(organisation);

        for (const singleDomain of organisationDto.domains) {
          const organisationDomain = new OrganisationDomainEntity();
          organisationDomain.organisation = organisation;
          organisationDomain.organisationId = organisation.id;
          organisationDomain.domain = singleDomain;
          await tem.save(organisationDomain);
        }

        const organisationEntityReloaded = await tem.findOne(
          OrganisationEntity,
          {
            where: { id: organisation.id },
            relations: ['organisationDomains'],
          },
        );

        this.eventEmitter.emit(
          'organisation-created',
          new OrganisationCreatedEvent(organisationEntityReloaded),
        );

        if (environment.opportunitySync.enabledOnInit) {
          if (organisationstageDto.stage) {
            await this.createOpportunityForOrganisation(
              organisationEntityReloaded,
              organisationstageDto.stage.text,
              tem,
            );
          }
        }

        return savedOrganisation;
      },
    );
  }

  public async createFromDataWarehouse(
    company: CompanyDto,
  ): Promise<OrganisationEntity> {
    return await this.organisationRepository.manager.transaction(
      async (tem) => {
        const organisation = new OrganisationEntity();
        organisation.name = company.name;
        organisation.initialDataSource = 'dwh';
        const savedOrganisation = await tem.save(organisation);

        const domains = this.domainResolver.extractDomains(company.domain);
        for (const singleDomain of domains) {
          const organisationDomain = new OrganisationDomainEntity();
          organisationDomain.organisation = organisation;
          organisationDomain.organisationId = organisation.id;
          organisationDomain.domain = singleDomain;
          await tem.save(organisationDomain);
        }

        const organisationEntityReloaded = await tem.findOne(
          OrganisationEntity,
          {
            where: { id: organisation.id },
            relations: ['organisationDomains'],
          },
        );
        this.eventEmitter.emit(
          'organisation-created',
          new OrganisationCreatedEvent(organisationEntityReloaded),
        );

        return organisationEntityReloaded;
      },
    );
  }

  public organisationEntityToData(
    entity: OrganisationEntity,
  ): OrganisationData {
    return {
      id: entity.id,
      name: entity.name,
      customDescription: entity.customDescription,
      customDescriptionUpdatedAt: entity.customDescriptionUpdatedAt,
      domains: entity.domains,
      companyStatus: entity.companyStatusOverride,
    };
  }

  public async getExistingByDomains(
    domains: string[],
  ): Promise<OrganisationEntity | null> {
    return await this.organisationRepository.findOne({
      relations: ['organisationDomains'],
      where: { organisationDomains: { domain: In(domains) } },
    });
  }

  public async createOpportunityForOrganisation(
    savedOrganisation: OrganisationEntity,
    stageText: string | null,
    tem?: EntityManager,
  ): Promise<OpportunityEntity> {
    if (!tem) {
      tem = this.organisationRepository.manager;
    }
    const defaultPipeline =
      await this.pipelineUtilityService.getDefaultPipelineDefinition();
    const pipelineStage =
      await this.pipelineUtilityService.mapStageForDefaultPipeline(stageText);
    const opportunity = new OpportunityEntity();
    opportunity.pipelineStage = pipelineStage;
    opportunity.pipelineDefinition = defaultPipeline;
    opportunity.organisation = savedOrganisation;

    return await tem.save(opportunity);
  }

  public async getRavenCompanies(): Promise<PagedOrganisationData> {
    const queryBuilder =
      await this.organisationRepository.createQueryBuilder('organisations');

    queryBuilder.leftJoinAndSelect(
      'organisations.organisationDomains',
      'domains',
    );
    queryBuilder.leftJoin('organisations.dataV1', 'data');

    queryBuilder.where('data.data IS NULL');
    queryBuilder.andWhere('domains.domain != :domain', {
      domain: 'https://placeholder.com',
    });

    const organisations = await queryBuilder.getMany();

    const affinityDomains = await this.affinityCacheService.getCompanyKeys();

    // Remove companies that are in the affinity cache by any domain
    const ravenOrganisations = organisations.filter((organisation) => {
      return !affinityDomains.some((domain) => {
        return organisation.domains.includes(
          domain
            .split(',')
            .map((d) => d.trim())
            .filter((d) => d !== '')[0],
        );
      });
    });
    return {
      items: ravenOrganisations.map((organisation) => {
        return {
          ...this.organisationEntityToData(organisation),
          opportunities: undefined,
        };
      }),
      total: ravenOrganisations.length,
    };
  }

  public async findNews(
    id: string,
    skip?: number,
    take?: number,
  ): Promise<PagedData<Partial<NewsDto>>> {
    const domains = (
      await this.organisationRepository.findOne({
        where: { id },
        relations: ['organisationDomains'],
      })
    )?.domains;

    return await this.dataWarehouseService.getNews(domains, skip, take);
  }

  public async findFundingRounds(
    id: string,
    skip?: number,
    take?: number,
  ): Promise<PagedData<Partial<FundingRoundDto>>> {
    const domains = (
      await this.organisationRepository.findOne({
        where: { id },
        relations: ['organisationDomains'],
      })
    )?.domains;

    return await this.dataWarehouseService.getFundingRounds(
      domains,
      skip,
      take,
    );
  }

  public async findEmployees(
    id: string,
    skip?: number,
    take?: number,
  ): Promise<PagedData<Partial<NumberOfEmployeesSnapshotDto>>> {
    const domains = (
      await this.organisationRepository.findOne({
        where: { id },
        relations: ['organisationDomains'],
      })
    )?.domains;

    return await this.dataWarehouseService.getEmployees(domains, skip, take);
  }

  public async findContacts(
    id: string,
    skip?: number,
    take?: number,
  ): Promise<PagedData<Partial<ContactDto>>> {
    const domains = (
      await this.organisationRepository.findOne({
        where: { id },
        relations: ['organisationDomains'],
      })
    )?.domains;

    return await this.dataWarehouseService.getContacts(domains, skip, take);
  }

  public async findInteractions(
    organisationId: string,
    startTime?: Date,
    endTime?: Date,
  ): Promise<Partial<InteractionsDto>> {
    const domains = (
      await this.organisationRepository.findOne({
        where: { id: organisationId },
        relations: ['organisationDomains'],
      })
    )?.domains;

    const organisations = await this.affinityCacheService.getByDomains(domains);

    if (organisations == null && organisations.length == 0) {
      return {
        items: [],
      };
    }

    const interactions = await this.affinityService.getInteractions({
      organizationIds: organisations.map((org) => org.organizationDto.id),
      startDate:
        startTime ?? new Date(new Date().setDate(new Date().getDate() - 30)),
      endDate: endTime ?? new Date(),
    });

    return interactions;
  }

  public async findLatestInteraction(organisationId: string): Promise<Date> {
    const domains = (
      await this.organisationRepository.findOne({
        where: { id: organisationId },
        relations: ['organisationDomains'],
      })
    )?.domains;

    const organisations = await this.affinityCacheService.getByDomains(domains);

    if (organisations == null && organisations.length == 0) {
      return null;
    }

    const latest = await this.affinityService.getLatestInteraction({
      organizationIds: organisations.map((org) => org.organizationDto.id),
    });

    return latest;
  }

  private sortOpportunities(data: OrganisationDataWithOpportunities): void {
    data.opportunities.sort((a, b) => {
      if (
        b.previousPipelineStageId === null &&
        a.previousPipelineStageId !== null
      )
        return 1;
      if (
        b.previousPipelineStageId === null &&
        a.previousPipelineStageId === null
      )
        return 0;
      if (
        b.previousPipelineStageId !== null &&
        a.previousPipelineStageId === null
      )
        return -1;

      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  }

  private async updateDomains(
    organisation: OrganisationEntity,
    domains: string[],
  ): Promise<void> {
    const cleanedDomains = this.domainResolver.cleanDomains(domains);
    const existingDomains = organisation.domains;
    const domainsToAdd = cleanedDomains.filter(
      (domain) => !existingDomains.includes(domain),
    );
    const domainsToRemove = existingDomains.filter(
      (domain) => !domains.includes(domain),
    );

    await this.organisationRepository.manager.transaction(async (tem) => {
      if (domainsToAdd.length > 0) {
        await tem.insert(
          OrganisationDomainEntity,
          domainsToAdd.map((d) => ({
            domain: d,
            organisation: organisation,
          })),
        );
      }

      if (domainsToRemove.length > 0) {
        await tem.delete(
          OrganisationDomainEntity,
          domainsToRemove.map((d) => ({
            domain: d,
            organisation: organisation,
          })),
        );
      }
    });
  }

  private evaluateCompanyStatus(
    entity: OrganisationEntity,
    data: OrganisationDataWithOpportunities,
  ): CompanyStatus | null {
    if (entity.companyStatusOverride) {
      return entity.companyStatusOverride;
    }

    if (!data.opportunities.length) {
      return null;
    }

    return data.opportunities[0].stage.relatedCompanyStatus;
  }
}
