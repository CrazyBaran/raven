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
import { RavenLogger } from '../rvn-logger/raven.logger';
import { PipelineDefinitionEntity } from '../rvn-pipeline/entities/pipeline-definition.entity';
import { PipelineStageEntity } from '../rvn-pipeline/entities/pipeline-stage.entity';
import { PipelineUtilityService } from '../rvn-pipeline/pipeline-utility.service';
import { TagEntity } from '../rvn-tags/entities/tag.entity';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { OpportunityEntity } from './entities/opportunity.entity';
import { OrganisationEntity } from './entities/organisation.entity';
import {
  CommonUpdateOptions,
  CreateOpportunityForNonExistingOrganisationOptions,
  CreateOpportunityForOrganisationOptions,
  UpdateOpportunityOptions,
} from './interfaces/create-update-organisation.options';
import { OpportunityTeamService } from './opportunity-team.service';
import { OpportunityChecker } from './opportunity.checker';
import { OrganisationService } from './organisation.service';

@Injectable()
export class OpportunityService {
  public constructor(
    private readonly logger: RavenLogger,
    @InjectRepository(OpportunityEntity)
    private readonly opportunityRepository: Repository<OpportunityEntity>,
    private readonly affinityCacheService: AffinityCacheService,
    private readonly affinityEnricher: AffinityEnricher,
    private readonly organisationService: OrganisationService,
    private readonly opportunityTeamService: OpportunityTeamService,
    private readonly eventEmitter: EventEmitter2,
    private readonly pipelineUtilityService: PipelineUtilityService,
    private readonly opportunityChecker: OpportunityChecker,
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
      .leftJoinAndSelect('organisation.organisationDomains', 'od')
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
        .leftJoinAndSelect(
          'subOrganisation.organisationDomains',
          'organisationDomains',
        )
        .select('subOrganisation.id', 'organisationDomains.domain')
        .where('LOWER(subOrganisation.name) LIKE :searchString')
        .orWhere('LOWER(organisationDomains.domain) LIKE :searchString');

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

    const defaultPipelineDefinition =
      await this.pipelineUtilityService.getDefaultPipelineDefinition();
    const items = await this.affinityEnricher.enrichOpportunities(
      result[0],
      async (entity, data) => {
        const pipelineStage =
          await this.pipelineUtilityService.getPipelineStageOrDefault(
            entity.pipelineStageId,
            defaultPipelineDefinition,
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
        'organisation.organisationDomains',
        'pipelineDefinition',
        'pipelineStage',
        'tag',
        'files',
        'files.tags',
      ],
    });

    const teamForOpportunity =
      await this.opportunityTeamService.getOpportunityTeam(opportunity);

    const defaultPipelineDefinition =
      await this.pipelineUtilityService.getDefaultPipelineDefinition();

    return await this.affinityEnricher.enrichOpportunity(
      opportunity,
      async (entity, data) => {
        const pipelineStage =
          await this.pipelineUtilityService.getPipelineStageOrDefault(
            entity.pipelineStageId,
            defaultPipelineDefinition,
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

    const defaultPipelineDefinition =
      await this.pipelineUtilityService.getDefaultPipelineDefinition();
    const items = await this.affinityEnricher.enrichOpportunities(
      opportunities,
      async (entity, data) => {
        const pipelineStage =
          await this.pipelineUtilityService.getPipelineStageOrDefault(
            entity.pipelineStageId,
            defaultPipelineDefinition,
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
    await this.opportunityChecker.ensureNoConflictingOpportunity(
      options.organisation,
    );

    const defaultPipeline =
      await this.pipelineUtilityService.getDefaultPipelineDefinition();
    const defaultPipelineStage =
      await this.pipelineUtilityService.getDefaultPipelineStage();

    const opportunity = await this.createOpportunity(
      options.organisation,
      defaultPipeline,
      defaultPipelineStage,
    );

    this.eventEmitter.emit(
      'opportunity-stage-changed',
      new OpportunityStageChangedEvent(
        opportunity.organisation.name,
        opportunity.organisation.domains,
        defaultPipelineStage.mappedFrom,
      ),
    );

    return opportunity;
  }

  public async createForNonExistingOrganisation(
    options: CreateOpportunityForNonExistingOrganisationOptions,
  ): Promise<OpportunityEntity> {
    const defaultPipeline =
      await this.pipelineUtilityService.getDefaultPipelineDefinition();
    const defaultPipelineStage =
      await this.pipelineUtilityService.getDefaultPipelineStage();

    const organisation = await this.organisationService.create({
      domain: options.domain,
      name: options.name,
    });

    const createdOrganisation = await this.organisationService.findByDomain(
      options.domain,
    );

    const opportunity = await this.createOpportunity(
      createdOrganisation,
      defaultPipeline,
      defaultPipelineStage,
    );

    this.eventEmitter.emit(
      'opportunity-stage-changed',
      new OpportunityStageChangedEvent(
        createdOrganisation.name,
        createdOrganisation.domains,
        defaultPipelineStage.mappedFrom,
      ),
    );

    return opportunity;
  }

  public async update(
    opportunity: OpportunityEntity,
    options: UpdateOpportunityOptions,
    userEntity: UserEntity,
  ): Promise<OpportunityEntity> {
    if (options.pipelineStage) {
      await this.opportunityChecker.ensureNoConflictingOpportunity(
        opportunity.organisation,
        opportunity,
        options.pipelineStage,
      );

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

    const reloadedOpportunity = await this.opportunityRepository.findOne({
      where: { id: opportunityEntity.id },
      relations: ['organisation', 'organisation.organisationDomains'],
    });

    // if pipeline stage was changed, emit event
    if (
      options.pipelineStage &&
      !(await this.opportunityChecker.hasActivePipelineItemOtherThan(
        reloadedOpportunity.organisation,
        reloadedOpportunity,
      ))
    ) {
      this.eventEmitter.emit(
        'opportunity-stage-changed',
        new OpportunityStageChangedEvent(
          opportunity.organisation.name,
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
      updatedAt: entity.updatedAt,
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
      relations: ['organisation', 'organisation.organisationDomains'],
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

        const pipeline =
          await this.pipelineUtilityService.getDefaultPipelineDefinition();
        const pipelineStage =
          await this.pipelineUtilityService.mapStageForDefaultPipeline(
            affinityEntry.stage?.text,
          );

        await this.createOpportunity(organisation, pipeline, pipelineStage);
      }
    }
  }

  private assignOpportunityProperties(
    opportunity: OpportunityEntity,
    options: CommonUpdateOptions,
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
  ): Promise<OpportunityEntity> {
    const opportunity = new OpportunityEntity();
    opportunity.organisation = organisation;
    opportunity.pipelineDefinition = pipeline;
    opportunity.pipelineStage = pipelineStage;

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
