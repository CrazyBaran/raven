import {
  OrganisationData,
  OrganisationDataWithOpportunities,
  PagedOrganisationData,
} from '@app/rvns-opportunities';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { EntityManager, Like, Raw, Repository } from 'typeorm';
import { environment } from '../../../environments/environment';
import { AffinityCacheService } from '../rvn-affinity-integration/cache/affinity-cache.service';
import { AffinityEnricher } from '../rvn-affinity-integration/cache/affinity.enricher';
import { OrganizationStageDto } from '../rvn-affinity-integration/dtos/organisation-stage.dto';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { PipelineDefinitionEntity } from '../rvn-pipeline/entities/pipeline-definition.entity';
import { PipelineStageEntity } from '../rvn-pipeline/entities/pipeline-stage.entity';
import { OpportunityEntity } from './entities/opportunity.entity';
import { OrganisationEntity } from './entities/organisation.entity';
import { OrganisationCreatedEvent } from './events/organisation-created.event';
import { OpportunityTeamService } from './opportunity-team.service';

interface CreateOrganisationOptions {
  name: string;
  domain: string;
  createOpportunity?: boolean;
}

interface UpdateOrganisationOptions {
  name?: string;
  domains?: string[];
}

@Injectable()
export class OrganisationService {
  public constructor(
    @InjectRepository(OrganisationEntity)
    private readonly organisationRepository: Repository<OrganisationEntity>,
    @InjectRepository(PipelineDefinitionEntity)
    private readonly pipelineRepository: Repository<PipelineDefinitionEntity>,
    private readonly affinityCacheService: AffinityCacheService,
    private readonly affinityEnricher: AffinityEnricher,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: RavenLogger,
    private readonly opportunityTeamService: OpportunityTeamService,
  ) {
    this.logger.setContext(OrganisationService.name);
  }

  public async findAll(
    options: {
      skip?: number;
      take?: number;
      dir?: 'ASC' | 'DESC';
      field?: 'name' | 'id';
      query?: string;
    } = {},
  ): Promise<PagedOrganisationData> {
    const queryBuilder =
      this.organisationRepository.createQueryBuilder('organisations');
    if (options.query) {
      const searchString = `%${options.query.toLowerCase()}%`;
      queryBuilder.where([
        {
          name: Raw(
            (alias) => `(CAST(${alias} as NVARCHAR(100))) LIKE :searchString`,
            {
              searchString,
            },
          ),
        },
        {
          domains: Raw(
            (alias) => `(CAST(${alias} as NVARCHAR(100))) LIKE :searchString`,
            {
              searchString,
            },
          ),
        },
      ]);
    }

    queryBuilder
      .leftJoinAndSelect('organisations.opportunities', 'opportunities')
      .leftJoinAndSelect('opportunities.pipelineStage', 'pipelineStage')
      .leftJoinAndSelect('opportunities.tag', 'tag')
      .leftJoinAndSelect('opportunities.shares', 'shares')
      .leftJoinAndSelect(
        'opportunities.pipelineDefinition',
        'pipelineDefinition',
      );

    queryBuilder.skip(options.skip).take(options.take);

    if (options.field) {
      queryBuilder.addOrderBy(
        `organisations.${options.field}`,
        options.dir || 'DESC',
      );
    } else {
      queryBuilder.addOrderBy('organisations.name', 'DESC');
    }

    const [organisations, count] = await queryBuilder.getManyAndCount();

    const defaultPipeline = await this.getDefaultPipelineDefinition();

    const teamsForOpportunities =
      await this.opportunityTeamService.getOpportunitiesTeams(
        (organisations as unknown as OrganisationDataWithOpportunities[])
          .map((org) => org.opportunities)
          .flat() as unknown as OpportunityEntity[],
      );

    const enrichedData = await this.affinityEnricher.enrichOrganisations(
      organisations,
      (entity, data) => {
        for (const opportunity of data.opportunities) {
          const pipelineStage = this.getPipelineStage(
            defaultPipeline,
            opportunity.stage.id,
          );

          opportunity.stage = {
            ...opportunity.stage,
            displayName: pipelineStage.displayName,
            order: pipelineStage.order,
            mappedFrom: pipelineStage.mappedFrom,
          };

          opportunity.team = teamsForOpportunities[opportunity.id];
        }

        return data;
      },
    );

    return {
      items: enrichedData,
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
      ],
    });

    const defaultPipeline = await this.getDefaultPipelineDefinition();

    return await this.affinityEnricher.enrichOrganisation(
      organisation,
      (entity, data) => {
        for (const opportunity of data.opportunities) {
          const pipelineStage = this.getPipelineStage(
            defaultPipeline,
            opportunity.stage.id,
          );

          opportunity.stage = {
            ...opportunity.stage,
            displayName: pipelineStage.displayName,
            order: pipelineStage.order,
            mappedFrom: pipelineStage.mappedFrom,
          };
        }

        return data;
      },
    );
  }

  public async create(
    options: CreateOrganisationOptions,
  ): Promise<OrganisationEntity> {
    return await this.organisationRepository.manager.transaction(
      async (tem) => {
        const organisation = new OrganisationEntity();
        organisation.name = options.name;
        organisation.domains = [options.domain];
        const organisationEntity = await tem.save(organisation);

        this.eventEmitter.emit(
          'organisation-created',
          new OrganisationCreatedEvent(organisationEntity),
        );

        if (options.createOpportunity) {
          const organizationStageDtos =
            await this.affinityCacheService.getByDomains([options.domain]);

          if (
            organizationStageDtos &&
            organizationStageDtos.length !== 0 &&
            organizationStageDtos[0].stage
          ) {
            await this.createOpportunityForOrganisation(
              organisationEntity,
              organizationStageDtos[0].stage?.text || null,
              tem,
            );
          }
          return organisationEntity;
        }
      },
    );
  }

  public async update(
    organisation: OrganisationEntity,
    options: UpdateOrganisationOptions,
  ): Promise<OrganisationEntity> {
    if (options.name) {
      organisation.name = options.name;
    }
    if (options.domains) {
      organisation.domains = options.domains;
    }
    return await this.organisationRepository.save(organisation);
  }

  public async remove(id: string): Promise<void> {
    await this.organisationRepository.delete(id);
  }

  public async ensureAllAffinityEntriesAsOrganisationsAndOpportunities(): Promise<void> {
    const affinityData = await this.affinityCacheService.getAll();
    const existingOrganisations = await this.organisationRepository.find();
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

  public getNonExistentAffinityData(
    affinityData: OrganizationStageDto[],
    existingOrganisations: OrganisationEntity[],
  ): OrganizationStageDto[] {
    return affinityData.filter((affinity) => {
      return !existingOrganisations.some((opportunity) => {
        return opportunity.domains.some((domain) => {
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
        organisation.domains = organisationDto.domains;
        const savedOrganisation = await tem.save(organisation);

        this.eventEmitter.emit(
          'organisation-created',
          new OrganisationCreatedEvent(savedOrganisation),
        );

        if (environment.opportunitySync.enabledOnInit) {
          if (organisationstageDto.stage) {
            await this.createOpportunityForOrganisation(
              savedOrganisation,
              organisationstageDto.stage.text,
              tem,
            );
          }
        }

        return savedOrganisation;
      },
    );
  }

  public organisationEntityToData(
    entity: OrganisationEntity,
  ): OrganisationData {
    return {
      id: entity.id,
      name: entity.name,
      domains: entity.domains,
    };
  }

  public async exists(domains: string[]): Promise<boolean> {
    const existingOrganisation = await this.organisationRepository.findOne({
      where: { domains: Like(`%${domains[0]}%`) },
    });

    return !!existingOrganisation;
  }

  public mapPipelineStage(
    pipelineDefinition: PipelineDefinitionEntity,
    text: string,
  ): PipelineStageEntity {
    if (!text) {
      return pipelineDefinition.stages.find(
        (s: { order: number }) => s.order === 1,
      );
    }
    return pipelineDefinition.stages.find((s: { mappedFrom: string }) =>
      text.toLowerCase().includes(s.mappedFrom.toLowerCase()),
    );
  }

  private getPipelineStage(
    pipelineDefinition: PipelineDefinitionEntity,
    id: string,
  ): PipelineStageEntity {
    const pipelineStage = pipelineDefinition.stages.find(
      (s: { id: string }) => s.id === id,
    );
    if (!pipelineStage) {
      throw new Error('Pipeline stage not found! Incorrect configuration');
    }
    return pipelineStage;
  }

  private async getDefaultPipelineDefinition(): Promise<PipelineDefinitionEntity> {
    const pipelineDefinition = await this.pipelineRepository.findOne({
      relations: ['stages'],
      where: {
        isDefault: true,
      },
    });
    return pipelineDefinition;
  }

  private async createOpportunityForOrganisation(
    savedOrganisation: OrganisationEntity,
    stageText: string | null,
    tem: EntityManager,
  ): Promise<OpportunityEntity> {
    const defaultPipeline = await this.getDefaultPipelineDefinition();
    const pipelineStage = this.mapPipelineStage(defaultPipeline, stageText);
    const opportunity = new OpportunityEntity();
    opportunity.pipelineStage = pipelineStage;
    opportunity.pipelineDefinition = defaultPipeline;
    opportunity.organisation = savedOrganisation;

    return await tem.save(opportunity);
  }
}
