import {
  OrganisationData,
  OrganisationDataWithOpportunities,
  PagedOrganisationData,
} from '@app/rvns-opportunities';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { Like, Raw, Repository } from 'typeorm';
import { OrganizationDto } from '../rvn-affinity-integration/api/dtos/organization.dto';
import { AffinityCacheService } from '../rvn-affinity-integration/cache/affinity-cache.service';
import { AffinityEnricher } from '../rvn-affinity-integration/cache/affinity.enricher';
import { OrganizationStageDto } from '../rvn-affinity-integration/dtos/organisation-stage.dto';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { PipelineDefinitionEntity } from '../rvn-pipeline/entities/pipeline-definition.entity';
import { PipelineStageEntity } from '../rvn-pipeline/entities/pipeline-stage.entity';
import { OrganisationEntity } from './entities/organisation.entity';
import { OrganisationCreatedEvent } from './events/organisation-created.event';

interface CreateOrganisationOptions {
  name: string;
  domain: string;
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
    const organisation = new OrganisationEntity();
    organisation.name = options.name;
    organisation.domains = [options.domain];
    const organisationEntity =
      await this.organisationRepository.save(organisation);
    this.eventEmitter.emit(
      'organisation-created',
      new OrganisationCreatedEvent(organisationEntity),
    );
    return organisationEntity;
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

  public async ensureAllAffinityEntriesAsOrganisations(): Promise<void> {
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
      await this.createFromAffinity(organisation.organizationDto);
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
    organizationDto: OrganizationDto,
  ): Promise<OrganisationEntity> {
    const organisation = new OrganisationEntity();
    organisation.name = organizationDto.name;
    organisation.domains = organizationDto.domains;

    return await this.organisationRepository.save(organisation);
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

  // TODO using this might cause problem in the future if we would switch to use multiple pipelines
  private async getDefaultPipelineDefinition(): Promise<PipelineDefinitionEntity> {
    const pipelineDefinitions = await this.pipelineRepository.find({
      relations: ['stages'],
    });
    if (pipelineDefinitions.length !== 1) {
      throw new Error('There should be only one pipeline definition!');
    }
    return pipelineDefinitions[0];
  }
}
