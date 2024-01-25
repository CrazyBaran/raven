import {
  OpportunityCreatedEvent,
  OpportunityData,
  OpportunityStageChangedEvent,
  PagedOpportunityData,
} from '@app/rvns-opportunities';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { environment } from '../../../environments/environment';
import { SharepointDirectoryStructureGenerator } from '../../shared/sharepoint-directory-structure.generator';
import { AffinityCacheService } from '../rvn-affinity-integration/cache/affinity-cache.service';
import { AffinityEnricher } from '../rvn-affinity-integration/cache/affinity.enricher';
import { OrganizationStageDto } from '../rvn-affinity-integration/dtos/organisation-stage.dto';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { PipelineDefinitionEntity } from '../rvn-pipeline/entities/pipeline-definition.entity';
import { PipelineStageEntity } from '../rvn-pipeline/entities/pipeline-stage.entity';
import { TagEntity } from '../rvn-tags/entities/tag.entity';
import { TemplateEntity } from '../rvn-templates/entities/template.entity';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { OpportunityEntity } from './entities/opportunity.entity';
import { OrganisationEntity } from './entities/organisation.entity';
import { OpportunityTeamService } from './opportunity-team.service';
import { OrganisationService } from './organisation.service';

interface CreateOpportunityForNonExistingOrganisationOptions
  extends CommonCreateOpportunityOptions {
  domain: string;
  name: string;
}

interface CreateOpportunityForOrganisationOptions
  extends CommonCreateOpportunityOptions {
  organisation: OrganisationEntity;
}

interface CommonCreateOpportunityOptions extends CommonCreateAndUpdateOptions {
  workflowTemplateEntity: TemplateEntity | null;
  userEntity: UserEntity;
  tagEntity: TagEntity;
}

interface UpdateOpportunityOptions extends CommonCreateAndUpdateOptions {
  pipelineStage?: PipelineStageEntity;
  tagEntity?: TagEntity;
}

interface CommonCreateAndUpdateOptions {
  roundSize?: string;
  valuation?: string;
  proposedInvestment?: string;
  positioning?: string;
  timing?: string;
  underNda?: string;
  ndaTerminationDate?: Date;
}

@Injectable()
export class OpportunityService {
  public constructor(
    private readonly logger: RavenLogger,
    @InjectRepository(OpportunityEntity)
    private readonly opportunityRepository: Repository<OpportunityEntity>,
    @InjectRepository(PipelineDefinitionEntity)
    private readonly pipelineRepository: Repository<PipelineDefinitionEntity>,
    private readonly affinityCacheService: AffinityCacheService,
    private readonly affinityEnricher: AffinityEnricher,
    private readonly organisationService: OrganisationService,
    private readonly opportunityTeamService: OpportunityTeamService,

    private readonly eventEmitter: EventEmitter2,
  ) {
    this.logger.setContext(OpportunityService.name);
  }

  public async findAll(
    options: {
      skip?: number;
      take?: number;
      pipelineStageId?: string;
      dir?: 'ASC' | 'DESC';
      field?: string;
      query?: string;
      member?: string;
      round?: string;
    } = {},
  ): Promise<PagedOpportunityData> {
    const queryBuilder = this.opportunityRepository
      .createQueryBuilder('opportunity')
      .leftJoinAndSelect('opportunity.organisation', 'organisation')
      .leftJoinAndSelect('opportunity.pipelineStage', 'pipelineStage')
      .leftJoinAndSelect('opportunity.tag', 'tag')
      .leftJoinAndSelect('opportunity.files', 'files')
      .leftJoinAndSelect('opportunity.shares', 'shares')
      .leftJoinAndSelect('shares.actor', 'member');

    if (options.pipelineStageId) {
      queryBuilder.andWhere('opportunity.pipelineStageId = :pipelineStageId', {
        pipelineStageId: options.pipelineStageId,
      });
    }

    if (options.member) {
      queryBuilder.andWhere('member.id = :member', {
        member: options.member,
      });
    }

    if (options.query) {
      const searchString = `%${options.query.toLowerCase()}%`;
      const organisationSubQuery = this.opportunityRepository.manager
        .createQueryBuilder(OrganisationEntity, 'subOrganisation')
        .select('subOrganisation.id')
        .where(
          '(CAST(subOrganisation.name as NVARCHAR(255))) LIKE :searchString',
        )
        .orWhere(
          '(CAST(subOrganisation.domains as NVARCHAR(1024))) LIKE :searchString',
        );

      queryBuilder
        .andWhere(
          `opportunity.organisationId IN (${organisationSubQuery.getQuery()})`,
        )
        .setParameter('searchString', searchString);
    }

    let tagEntities = [];

    if (options.round) {
      const tagAssignedTo = await this.opportunityRepository.manager
        .createQueryBuilder(TagEntity, 'tag')
        .select()
        .where('tag.name = :round', { round: options.round })
        .getOne();

      if (tagAssignedTo) tagEntities = [...tagEntities, tagAssignedTo];
    }

    if (tagEntities) {
      for (const tag of tagEntities) {
        const tagSubQuery = this.opportunityRepository
          .createQueryBuilder('opportunity_with_tag')
          .select('opportunity_with_tag.id')
          .innerJoin('opportunity_with_tag.tag', 'subquerytag')
          .where('subquerytag.id = :tagId');

        queryBuilder
          .andWhere(`opportunity.id IN (${tagSubQuery.getQuery()})`)
          .setParameter('tagId', tag.id);
      }
    }

    if (options.dir && options.field) {
      queryBuilder.orderBy(`opportunity.${options.field}`, options.dir);
    }

    if (options.skip || options.take) {
      queryBuilder.skip(options.skip ?? 0).take(options.take ?? 10);
    }

    const result = await queryBuilder.getManyAndCount();

    const teamsForOpportunities =
      await this.opportunityTeamService.getOpportunitiesTeams(result[0]);

    const defaultPipeline = await this.getDefaultPipelineDefinition();

    const items = await this.affinityEnricher.enrichOpportunities(
      result[0],
      (entity, data) => {
        const pipelineStage = this.getPipelineStage(
          defaultPipeline,
          entity.pipelineStageId,
        );

        data = {
          ...data,
          stage: {
            ...data.stage,
            displayName: pipelineStage.displayName,
            order: pipelineStage.order,
            mappedFrom: pipelineStage.mappedFrom,
          },
          team: teamsForOpportunities[entity.id],
        };
        return data;
      },
    );

    return { items, total: result[1] } as PagedOpportunityData;
  }

  public async findOne(id: string): Promise<OpportunityData | null> {
    const opportunity = await this.opportunityRepository.findOne({
      where: { id },
      relations: [
        'organisation',
        'pipelineDefinition',
        'pipelineStage',
        'tag',
        'files',
        'files.tags',
      ],
    });

    const defaultPipeline = await this.getDefaultPipelineDefinition();

    const teamForOpportunity =
      await this.opportunityTeamService.getOpportunityTeam(opportunity);

    return await this.affinityEnricher.enrichOpportunity(
      opportunity,
      (entity, data) => {
        const pipelineStage = this.getPipelineStage(
          defaultPipeline,
          entity.pipelineStageId,
        );

        data = {
          ...data,
          stage: {
            ...data.stage,
            displayName: pipelineStage.displayName,
            order: pipelineStage.order,
            mappedFrom: pipelineStage.mappedFrom,
          },
          sharePointDirectory:
            SharepointDirectoryStructureGenerator.getDirectoryForSharepointEnabledEntity(
              entity,
            ),
          sharePointPath: `${
            environment.sharePoint.rootDirectory
          }/${SharepointDirectoryStructureGenerator.getDirectoryNameForOrganisation(
            entity.organisation,
          )}/${SharepointDirectoryStructureGenerator.getDirectoryNameForOpportunity(
            entity,
          )}`,
          team: teamForOpportunity,
        };
        return data;
      },
    );
  }

  public async findByDomain(domain: string): Promise<PagedOpportunityData> {
    const opportunities = await this.opportunityRepository.find({
      where: { organisation: { organisationDomains: { domain: domain } } },
      relations: ['organisation', 'tag', 'organisation.organisationDomains'],
    });
    const defaultPipeline = await this.getDefaultPipelineDefinition();

    const items = await this.affinityEnricher.enrichOpportunities(
      opportunities,
      (entity, data) => {
        const pipelineStage = this.getPipelineStage(
          defaultPipeline,
          entity.pipelineStageId,
        );

        data = {
          ...data,
          stage: {
            ...data.stage,
            displayName: pipelineStage.displayName,
            order: pipelineStage.order,
            mappedFrom: pipelineStage.mappedFrom,
          },
        };
        return data;
      },
    );

    return { items, total: items.length } as PagedOpportunityData;
  }

  public async createFromOrganisation(
    options: CreateOpportunityForOrganisationOptions,
  ): Promise<OpportunityEntity> {
    const { pipeline, pipelineStage } =
      await this.getDefaultPipelineAndFirstStage();

    const affinityOrganisation = await this.affinityCacheService.getByDomains(
      options.organisation.domains,
    );

    const affinityPipelineStage = this.organisationService.mapPipelineStage(
      pipeline,
      affinityOrganisation[0]?.stage?.text,
    );

    return await this.createOpportunity(
      options.organisation,
      pipeline,
      affinityPipelineStage ? affinityPipelineStage : pipelineStage,
      options,
    );
  }

  public async createForNonExistingOrganisation(
    options: CreateOpportunityForNonExistingOrganisationOptions,
  ): Promise<OpportunityEntity> {
    const { pipeline, pipelineStage } =
      await this.getDefaultPipelineAndFirstStage();

    const organisation = await this.organisationService.create({
      domain: options.domain,
      name: options.name,
    });

    return await this.createOpportunity(
      organisation,
      pipeline,
      pipelineStage,
      options,
    );
  }

  public async update(
    opportunity: OpportunityEntity,
    options: UpdateOpportunityOptions,
    userEntity: UserEntity,
  ): Promise<OpportunityEntity> {
    if (options.pipelineStage) {
      if (
        this.shouldUpdatePreviousPipelineStage(
          opportunity,
          options.pipelineStage,
        )
      ) {
        opportunity.previousPipelineStage = opportunity.pipelineStage;
      } else if (
        this.shouldClearPreviousPipelineStage(
          opportunity,
          options.pipelineStage,
        )
      ) {
        opportunity.previousPipelineStage = null;
      }
      opportunity.pipelineStage = options.pipelineStage;
    }
    if (options.tagEntity) {
      opportunity.tag = options.tagEntity;
    }
    this.assignOpportunityProperties(opportunity, options);

    delete opportunity.shares;

    const opportunityEntity =
      await this.opportunityRepository.save(opportunity);

    // if pipeline stage was changed, emit event
    if (options.pipelineStage) {
      this.eventEmitter.emit(
        'opportunity-stage-changed',
        new OpportunityStageChangedEvent(
          opportunityEntity.organisation.domains,
          options.pipelineStage.mappedFrom,
        ),
      );
    }

    // if opportunity had no workflow note and tag is now set, it's time for opportunity to become a real opportunity with note and folder structure
    if (!opportunity.noteId && options.tagEntity) {
      this.eventEmitter.emit(
        'opportunity-created',
        new OpportunityCreatedEvent(opportunityEntity.id, null, userEntity.id),
      );
    }

    return opportunityEntity;
  }

  public async remove(id: string): Promise<void> {
    await this.opportunityRepository.delete(id);
  }

  public entityToData(
    entity?: OpportunityEntity,
    affinityDto?: OrganizationStageDto,
  ): OpportunityData {
    return {
      id: entity?.id,
      organisation: {
        affinityInternalId: affinityDto?.organizationDto?.id,
        id: entity?.organisationId,
        name: affinityDto?.organizationDto?.name,
        domains: affinityDto?.organizationDto?.domains,
        affinityUrl: affinityDto?.organizationDto
          ? `${environment.affinity.affinityUrl}companies/${affinityDto.organizationDto.id}`
          : '',
      },
      stage: {
        id: entity?.pipelineStage?.id,
        displayName: entity?.pipelineStage?.displayName,
        order: entity?.pipelineStage?.order,
        mappedFrom: entity?.pipelineStage?.mappedFrom,
      },
      tag: entity.tag && {
        id: entity.tag.id,
        name: entity.tag.name,
      },
      createdAt: entity?.createdAt,
      fields: affinityDto?.fields.map((field) => {
        return {
          displayName: field.displayName,
          value: field.value,
        };
      }),
    };
  }

  public opportunityEntityToData(entity: OpportunityEntity): OpportunityData {
    return {
      id: entity.id,
      organisation: {
        id: entity.organisationId,
        name: entity.organisation?.name,
        domains: entity.organisation?.domains,
      },
      stage: {
        id: entity.pipelineStage.id,
        displayName: entity.pipelineStage.displayName,
        order: entity.pipelineStage.order,
        mappedFrom: entity.pipelineStage.mappedFrom,
      },
      tag: entity.tag
        ? { id: entity.tag.id, name: entity.tag.name }
        : undefined,
      fields: [],
      createdAt: entity.createdAt,
      roundSize: entity.roundSize,
      valuation: entity.valuation,
      proposedInvestment: entity.proposedInvestment,
      positioning: entity.positioning,
      timing: entity.timing,
      underNda: entity.underNda,
      ndaTerminationDate: entity.ndaTerminationDate,
    };
  }

  public async ensureAllAffinityEntriesAsOpportunities(): Promise<void> {
    const affinityData = await this.affinityCacheService.getAll(
      (data) => data.stage != null && data.stage.text != null,
    );
    const opportunities = await this.opportunityRepository.find({
      relations: ['organisation'],
    });

    for (const affinityEntry of affinityData) {
      const existingOpportunity = opportunities.find((opportunity) =>
        opportunity.organisation.domains.includes(
          affinityEntry.organizationDto.domain,
        ),
      );
      if (!existingOpportunity) {
        const organisation = await this.organisationService.findByDomain(
          affinityEntry.organizationDto.domain,
        );

        const pipeline = await this.getDefaultPipelineDefinition();
        const pipelineStage = this.getPipelineStage(
          pipeline,
          affinityEntry.stage.text,
        );

        await this.createOpportunity(organisation, pipeline, pipelineStage, {
          workflowTemplateEntity: null,
          userEntity: null,
          tagEntity: null,
        });
      }
    }

    const defaultPipeline = await this.getDefaultPipelineDefinition();
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

  private getPipelineStage(
    pipelineDefinition: PipelineDefinitionEntity,
    id: string,
  ): PipelineStageEntity {
    const pipelineStage = pipelineDefinition.stages.find(
      (s: { id: string }) => s.id === id,
    );
    if (!pipelineStage) {
      if (!pipelineStage) {
        const defaultStage = pipelineDefinition.stages.find(
          (s: { order: number }) => s.order === 1,
        );

        return defaultStage;
      }
    }
    return pipelineStage;
  }

  private async getDefaultPipelineAndFirstStage(): Promise<{
    pipeline: PipelineDefinitionEntity;
    pipelineStage: PipelineStageEntity;
  }> {
    const pipeline = await this.getDefaultPipelineDefinition();
    const pipelineStage = pipeline.stages.find(
      (s: { order: number }) => s.order === 1,
    );
    if (!pipelineStage) {
      throw new Error(
        'Pipeline stage with order = 1 not found! Incorrect configuration',
      );
    }
    return { pipeline, pipelineStage };
  }

  private assignOpportunityProperties(
    opportunity: OpportunityEntity,
    options: CommonCreateAndUpdateOptions,
  ): void {
    if (options.roundSize !== undefined) {
      opportunity.roundSize = options.roundSize;
    }
    if (options.valuation !== undefined) {
      opportunity.valuation = options.valuation;
    }
    if (options.proposedInvestment !== undefined) {
      opportunity.proposedInvestment = options.proposedInvestment;
    }
    if (options.positioning !== undefined) {
      opportunity.positioning = options.positioning;
    }
    if (options.timing !== undefined) {
      opportunity.timing = options.timing;
    }
    if (options.underNda !== undefined) {
      opportunity.underNda = options.underNda;
    }
    if (options.ndaTerminationDate !== undefined) {
      opportunity.ndaTerminationDate = options.ndaTerminationDate;
    }
  }

  private async createOpportunity(
    organisation: OrganisationEntity,
    pipeline: PipelineDefinitionEntity,
    pipelineStage: PipelineStageEntity,
    options: CommonCreateOpportunityOptions,
  ): Promise<OpportunityEntity> {
    const opportunity = new OpportunityEntity();
    opportunity.organisation = organisation;
    opportunity.pipelineDefinition = pipeline;
    opportunity.pipelineStage = pipelineStage;
    opportunity.tag = options.tagEntity;
    this.assignOpportunityProperties(opportunity, options);

    return await this.opportunityRepository.save(opportunity);
  }

  private shouldUpdatePreviousPipelineStage(
    opportunity: OpportunityEntity,
    nextPipelineStage: PipelineStageEntity,
  ): boolean {
    return !!(
      !opportunity.pipelineStage.configuration &&
      nextPipelineStage.configuration
    );
  }

  private shouldClearPreviousPipelineStage(
    opportunity: OpportunityEntity,
    nextPipelineStage: PipelineStageEntity,
  ): boolean {
    return (
      opportunity.pipelineStage.configuration &&
      !nextPipelineStage.configuration
    );
  }
}
