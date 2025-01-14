import {
  OrganisationData,
  OrganisationDataWithOpportunities,
  PagedOrganisationData,
} from '@app/rvns-opportunities';
import { BadRequestException, Injectable, Optional } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { TagTypeEnum } from '@app/rvns-tags';
import { InteractionsDto } from '@app/shared/affinity';
import {
  CompanyDto,
  ContactDto,
  FundingRoundDto,
  FundingRoundInvestor,
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
import {
  OrganisationTagEntity,
  TagEntity,
} from '../rvn-tags/entities/tag.entity';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { DomainResolver } from '../rvn-utils/domain.resolver';
import { ExecutionTimeHelper } from '../rvn-utils/execution-time-helper';
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

    if (options.take === 0) {
      throw new BadRequestException('options.take cannot be 0.');
    }

    ExecutionTimeHelper.startTime('organisationProvider.getOrganisations');
    const { organisationIds, count } =
      await this.organisationProvider.getOrganisations(
        options,
        options?.filters,
      );
    ExecutionTimeHelper.endTime('organisationProvider.getOrganisations');

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

    ExecutionTimeHelper.startTime('organisationService.mainQuery');
    const organisations = await queryBuilder.getMany();
    ExecutionTimeHelper.endTime('organisationService.mainQuery');

    ExecutionTimeHelper.startTime('organisationSerice.getTeams');
    const teamsForOpportunities =
      await this.opportunityTeamService.getOpportunitiesTeams(
        (organisations as unknown as OrganisationDataWithOpportunities[])
          .map((org) => org.opportunities)
          .flat() as unknown as OpportunityEntity[],
      );
    ExecutionTimeHelper.endTime('organisationSerice.getTeams');

    ExecutionTimeHelper.startTime('organisationSerice.affinityEnrich');
    const pipelineStageTemp = {};
    const affinityEnrichedData =
      await this.affinityEnricher.enrichOrganisations(
        organisations,
        async (entity, data) => {
          this.sortOpportunities(data);
          ExecutionTimeHelper.startTime(
            'organisationSerice.affinityEnrich',
            'stage-assign',
          );

          for (const opportunity of data.opportunities) {
            const pipelineStage =
              pipelineStageTemp[opportunity.stage.id] ??
              (await this.pipelineUtilityService.getPipelineStageOrDefault(
                opportunity.stage.id,
              ));

            pipelineStageTemp[opportunity.stage.id] = pipelineStage;

            opportunity.stage = {
              ...opportunity.stage,
              displayName: pipelineStage.displayName,
              order: pipelineStage.order,
              mappedFrom: pipelineStage.mappedFrom,
              relatedCompanyStatus: pipelineStage.relatedCompanyStatus,
            };

            opportunity.team = teamsForOpportunities[opportunity.id];
          }
          ExecutionTimeHelper.endTime(
            'organisationSerice.affinityEnrich',
            'stage-assign',
          );

          data.companyStatus = this.evaluateCompanyStatus(entity, data);
          data.shortlists = entity.shortlists
            ?.slice(0, 25)
            ?.map((shortlist) => ({ id: shortlist.id, name: shortlist.name }));

          data.fundManagerId = entity.fundManagerId ?? null;
          return data;
        },
      );
    ExecutionTimeHelper.endTime('organisationSerice.affinityEnrich');

    ExecutionTimeHelper.startTime('organisationSerice.dwhEnrich');
    const enrichedData = this.dataWarehouseEnricher
      ? await this.dataWarehouseEnricher?.enrichOrganisations(
          affinityEnrichedData,
        )
      : affinityEnrichedData;
    ExecutionTimeHelper.endTime('organisationSerice.dwhEnrich');
    ExecutionTimeHelper.printFullLog();
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

  public async ensureAllAffinityOrganisationsAsOrganisations(
    job: JobPro,
  ): Promise<void> {
    const affinityData = await this.affinityCacheService.getAll();

    // Extract unique domains from affinityData
    const domains = new Set<string>();
    for (const data of affinityData) {
      for (const domain of data.organizationDto.domains) {
        domains.add(domain);
      }
    }

    // Convert Set to Array
    const domainArray = Array.from(domains);

    // Fetch organisations in batches
    const batchSize = 2000;
    const existingOrganisations = [];

    const fetchBatch = async (
      batch: Array<string>,
    ): Promise<Array<OrganisationEntity>> => {
      return await this.organisationRepository
        .createQueryBuilder('organisation')
        .leftJoinAndSelect(
          'organisation.organisationDomains',
          'organisationDomain',
        )
        .where('organisationDomain.domain IN (:...domains)', { domains: batch })
        .select(['organisation.id', 'organisationDomain.domain'])
        .getMany();
    };

    const batches: Array<Array<string>> = [];
    for (let i = 0; i < domainArray.length; i += batchSize) {
      const batch = domainArray.slice(i, i + batchSize);
      batches.push(batch);
    }

    for await (const batch of batches) {
      existingOrganisations.push(...(await fetchBatch(batch)));
    }

    const nonExistentAffinityData = this.getNonExistentAffinityData(
      affinityData,
      existingOrganisations,
    );

    job.log(
      `ensureAllAffinityOrganisationsAsOrganisations: Found ${nonExistentAffinityData.length} non-existent organisations`,
    );

    let i = 0;

    for (const organisation of nonExistentAffinityData) {
      await this.createFromAffinity(organisation);

      i++;
      await job.updateProgress(
        Math.round((i / nonExistentAffinityData.length) * 50),
      );
    }

    job.log(`ensureAllAffinityOrganisationsAsOrganisations: synced`);
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
    const domains = new Set<string>();
    for (const data of existingOrganisations) {
      for (const domain of data.domains) {
        domains.add(domain);
      }
    }

    return affinityData.filter((affinity) => {
      const affinityDomains = affinity?.organizationDto?.domains || [];

      if (affinityDomains.length === 0) return false;

      return !affinityDomains.some((domain) => domains.has(domain));
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
      fundManagerId: entity.fundManagerId,
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

    const fundingRounds = await this.dataWarehouseService.getFundingRounds(
      domains,
      skip,
      take,
    );
    const allInvestors = fundingRounds.items
      .map((round) => round.investors)
      .flat();

    const qb = this.tagRepository.createQueryBuilder('tag');
    qb.leftJoinAndSelect('tag.organisation', 'organisation');

    qb.where('tag.name IN (:...names)', {
      names: allInvestors,
    });
    qb.andWhere('tag.type = :tagType', { tagType: TagTypeEnum.Investor });

    qb.skip(0);
    qb.take(allInvestors.length || 1);

    const tags = await qb.getMany();

    for (const round of fundingRounds.items) {
      if (!round.investors?.length) {
        continue;
      }
      for (let i = 0; i < round.investors.length; i++) {
        const foundInvestorTag = tags.find(
          (v) => v.name === round.investors[i],
        ) as OrganisationTagEntity;
        round.investors[i] = foundInvestorTag
          ? {
              id: foundInvestorTag.id,
              name: foundInvestorTag.name,
              organisation: foundInvestorTag.organisation,
              organisationId: foundInvestorTag.organisationId,
            }
          : ({
              name: round.investors[i],
            } as FundingRoundInvestor);
      }
    }

    return fundingRounds;
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
      startDate: startTime,
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
