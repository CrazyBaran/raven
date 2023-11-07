import {
  OpportunityData,
  OpportunityStageChangedEvent,
} from '@app/rvns-opportunities';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { environment } from '../../../environments/environment';
import { AffinityCacheService } from '../rvn-affinity-integration/cache/affinity-cache.service';
import { OrganizationStageDto } from '../rvn-affinity-integration/dtos/organisation-stage.dto';
import { PipelineDefinitionEntity } from '../rvn-pipeline/entities/pipeline-definition.entity';
import { PipelineStageEntity } from '../rvn-pipeline/entities/pipeline-stage.entity';
import { TagEntity } from '../rvn-tags/entities/tag.entity';
import { OpportunityEntity } from './entities/opportunity.entity';
import { OrganisationEntity } from './entities/organisation.entity';
import { OrganisationService } from './organisation.service';

interface CreateOpportunityForNonExistingOrganisationOptions {
  domain: string;
  name: string;
}

interface CreateOpportunityForOrganisationOptions {
  organisation: OrganisationEntity;
}

interface UpdateOpportunityOptions {
  pipelineStage?: PipelineStageEntity;
  tag?: TagEntity;
}

@Injectable()
export class OpportunityService {
  public constructor(
    @InjectRepository(OpportunityEntity)
    private readonly opportunityRepository: Repository<OpportunityEntity>,
    @InjectRepository(PipelineDefinitionEntity)
    private readonly pipelineRepository: Repository<PipelineDefinitionEntity>,
    private readonly affinityCacheService: AffinityCacheService,
    private readonly organisationService: OrganisationService,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async findAll(
    skip = 0,
    take = 10,
    pipelineStageId?: string,
  ): Promise<OpportunityData[]> {
    const options = {
      where: pipelineStageId ? { pipelineStageId: pipelineStageId } : {},
      relations: ['organisation', 'tag'],
      skip: skip,
      take: take > 500 ? 500 : take,
    };

    const defaultPipeline = await this.getDefaultPipelineDefinition();

    const opportunities = await this.opportunityRepository.find(options);

    const affinityData = await this.affinityCacheService.getByDomains(
      opportunities.flatMap((opportunity) => opportunity.organisation.domains),
    );

    const combinedData: OpportunityData[] = [];

    for (const opportunity of opportunities) {
      if (!opportunity.organisation?.domains[0]) {
        continue;
      }
      const matchedOrganization = affinityData.find((org) =>
        org.organizationDto.domains.includes(
          opportunity.organisation?.domains[0],
        ),
      );

      const pipelineStage = this.getPipelineStage(
        defaultPipeline,
        opportunity.pipelineStageId,
      );
      const result: OpportunityData = {
        id: opportunity.id,
        organisation: {
          affinityInternalId: matchedOrganization
            ? matchedOrganization.organizationDto.id
            : undefined,
          id: opportunity.organisationId,
          name: matchedOrganization
            ? matchedOrganization.organizationDto.name
            : opportunity.organisation.name,
          domains: matchedOrganization
            ? matchedOrganization.organizationDto.domains
            : opportunity.organisation.domains,
          affinityUrl: matchedOrganization
            ? `${environment.affinity.affinityUrl}companies/${matchedOrganization.organizationDto.id}`
            : undefined,
        },
        stage: {
          id: opportunity.pipelineStageId,
          displayName: pipelineStage.displayName,
          order: pipelineStage.order,
          mappedFrom: pipelineStage.mappedFrom,
        },
        tag: opportunity.tag,
        fields:
          matchedOrganization?.fields.map((field) => {
            return {
              displayName: field.displayName,
              value: field.value,
            };
          }) || [],
      };

      combinedData.push(result);
    }

    return combinedData;
  }

  public async findOne(id: string): Promise<OpportunityData | null> {
    const opportunity = await this.opportunityRepository.findOne({
      where: { id },
      relations: ['organisation', 'pipelineDefinition', 'pipelineStage', 'tag'],
    });
    const affinityData = await this.affinityCacheService.getByDomains(
      opportunity.organisation.domains,
    );

    if (affinityData.length === 0) {
      return null;
    }

    return {
      id: opportunity.id,
      organisation: {
        id: opportunity.organisationId,
        name: opportunity.organisation?.name,
        domains: opportunity.organisation?.domains,
        affinityUrl: `${environment.affinity.affinityUrl}companies/${affinityData[0].organizationDto.id}`,
      },
      stage: {
        displayName: opportunity.pipelineStage.displayName,
        order: opportunity.pipelineStage.order,
      },
      tag: opportunity.tag
        ? { id: opportunity.tag.id, name: opportunity.tag.name }
        : undefined,
      fields: affinityData[0].fields.map((field) => {
        return {
          displayName: field.displayName,
          value: field.value,
        };
      }),
    } as OpportunityData;
  }

  public async findByDomain(domain: string): Promise<OpportunityData[]> {
    const opportunities = await this.opportunityRepository.find({
      where: { organisation: { domains: Like(`%${domain}%`) } },
      relations: ['organisation', 'tag'],
    });
    const affinityData = await this.affinityCacheService.getAll();

    const defaultDefinition = await this.getDefaultPipelineDefinition();
    if (opportunities.length > 0) {
      const matchedOrganization = affinityData.find((org) =>
        org.organizationDto.domains.includes(domain),
      );

      return opportunities.map((opportunity) => {
        return this.entityToData(opportunity, matchedOrganization);
      });
    } else {
      // If no opportunity is found, search for an organization in affinityData with the given domain
      const matchedOrganization = affinityData.find((org) =>
        org.organizationDto.domains.includes(domain),
      );

      if (matchedOrganization) {
        const pipelineStage = await this.mapPipelineStage(
          defaultDefinition,
          matchedOrganization?.stage?.text,
        );
        const result: OpportunityData = {
          id: undefined, // You might need to adjust this if there's a relevant ID
          organisation: {
            affinityInternalId: matchedOrganization.organizationDto.id,
            id: undefined, // Adjust this if there's a relevant ID
            name: matchedOrganization.organizationDto.name,
            domains: matchedOrganization.organizationDto.domains,
            affinityUrl: `${environment.affinity.affinityUrl}companies/${matchedOrganization.organizationDto.id}`,
          },
          stage: pipelineStage,
          fields: matchedOrganization.fields.map((field) => {
            return {
              displayName: field.displayName,
              value: field.value,
            };
          }),
        };

        return [result];
      }
    }

    return null;
  }

  public async createFromOrganisation(
    options: CreateOpportunityForOrganisationOptions,
  ): Promise<OpportunityEntity> {
    const { pipeline, pipelineStage } =
      await this.getDefaultPipelineAndFirstStage();

    const affinityOrganisation = this.affinityCacheService.getByDomains(
      options.organisation.domains,
    );

    const affinityPipelineStage = await this.mapPipelineStage(
      pipeline,
      affinityOrganisation[0]?.stage?.text,
    );

    const opportunity = new OpportunityEntity();
    opportunity.organisation = options.organisation;
    opportunity.pipelineDefinition = pipeline;
    opportunity.pipelineStage = affinityPipelineStage
      ? affinityPipelineStage
      : pipelineStage;

    return this.opportunityRepository.save(opportunity);
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

    const opportunity = new OpportunityEntity();
    opportunity.organisation = organisation;
    opportunity.pipelineDefinition = pipeline;
    opportunity.pipelineStage = pipelineStage;

    return this.opportunityRepository.save(opportunity);
  }

  public async update(
    opportunity: OpportunityEntity,
    options: UpdateOpportunityOptions,
  ): Promise<OpportunityEntity> {
    if (options.pipelineStage) {
      opportunity.pipelineStage = options.pipelineStage;
    }
    if (options.tag) {
      opportunity.tag = options.tag;
    }
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
        affinityUrl: `${environment.affinity.affinityUrl}companies/${affinityDto.organizationDto.id}`,
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
      fields: affinityDto?.fields.map((field) => {
        return {
          displayName: field.displayName,
          value: field.value,
        };
      }),
    };
  }

  public async ensureAllAffinityEntriesAsOpportunities(): Promise<void> {
    const affinityData = await this.affinityCacheService.getAll();

    const existingOpportunities = await this.opportunityRepository.find({
      relations: ['organisation'],
    });

    const nonexistentAffinityData = affinityData.filter((affinity) => {
      return !existingOpportunities.some((opportunity) => {
        return opportunity.organisation.domains.some((domain) => {
          if (affinity?.organizationDto?.domains?.length === 0) return true;
          return affinity.organizationDto.domains.includes(domain);
        });
      });
    });

    const defaultDefinition = await this.getDefaultPipelineDefinition();

    for (const org of nonexistentAffinityData) {
      const organisation =
        await this.organisationService.createFromAffinityOrGet(
          org.organizationDto.domains,
        );

      if (!organisation) {
        continue;
      }

      const existingOpportunity = await this.opportunityRepository.findOne({
        where: {
          organisation: { id: organisation.id },
        },
      });

      if (existingOpportunity) {
        continue;
      }

      const pipelineStage = await this.mapPipelineStage(
        defaultDefinition,
        org?.stage?.text,
      );

      const opportunity = new OpportunityEntity();

      opportunity.organisation = organisation;
      opportunity.pipelineDefinition = defaultDefinition;
      opportunity.pipelineStage = pipelineStage;

      await this.opportunityRepository.save(opportunity);
    }
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
    };
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

  private async mapPipelineStage(
    pipelineDefinition: PipelineDefinitionEntity,
    text: string,
  ): Promise<PipelineStageEntity> {
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
}
