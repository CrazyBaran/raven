import { OpportunityData } from '@app/rvns-opportunities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { AffinityCacheService } from '../rvn-affinity-integration/cache/affinity-cache.service';
import { OrganizationStageDto } from '../rvn-affinity-integration/dtos/organisation-stage.dto';
import { PipelineDefinitionEntity } from '../rvn-pipeline/entities/pipeline-definition.entity';
import { PipelineStageEntity } from '../rvn-pipeline/entities/pipeline-stage.entity';
import { OpportunityEntity } from './entities/opportunity.entity';
import { OrganisationService } from './organisation.service';

@Injectable()
export class OpportunityService {
  public constructor(
    @InjectRepository(OpportunityEntity)
    private readonly opportunityRepository: Repository<OpportunityEntity>,
    @InjectRepository(PipelineDefinitionEntity)
    private readonly pipelineRepository: Repository<PipelineDefinitionEntity>,
    private readonly affinityCacheService: AffinityCacheService,
    private readonly organisationService: OrganisationService,
  ) {}

  public async findAll(
    skip = 0,
    take = 10,
    pipelineStageId?: string,
  ): Promise<OpportunityData[]> {
    const options = {
      relations: ['organisation', 'pipelineDefinition', 'pipelineStage'],
    };
    const opportunities = await this.opportunityRepository.find(options);
    const affinityData = await this.affinityCacheService.getAll();

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
        },
        stage: {
          id: opportunity.pipelineStage.id,
          displayName: opportunity.pipelineStage.displayName,
          order: opportunity.pipelineStage.order,
          mappedFrom: opportunity.pipelineStage.mappedFrom,
        },
        fields: matchedOrganization.fields.map((field) => {
          return {
            displayName: field.displayName,
            value: field.value,
          };
        }),
      };

      combinedData.push(result);
    }

    const defaultDefinition = await this.getDefaultDefinition();
    for (const org of affinityData) {
      const isAlreadyIncluded = combinedData.some((data) =>
        data.organisation.domains.some((domain) =>
          org.organizationDto.domains.includes(domain),
        ),
      );

      if (!isAlreadyIncluded) {
        const pipelineStage = await this.mapStage(
          defaultDefinition,
          org?.stage?.text,
        );
        const result: OpportunityData = {
          id: undefined,
          organisation: {
            affinityInternalId: org.organizationDto.id,
            id: undefined,
            name: org.organizationDto.name,
            domains: org.organizationDto.domains,
          },
          stage: pipelineStage,
          fields: org.fields.map((field) => {
            return {
              displayName: field.displayName,
              value: field.value,
            };
          }),
        };

        combinedData.push(result);
      }
    }

    return combinedData
      .filter((data) => {
        if (!pipelineStageId) {
          return false;
        }
        return data.stage.id.toLowerCase() === pipelineStageId.toLowerCase();
      })
      .slice(skip, skip + take);
  }

  public async findOne(id: string): Promise<OpportunityData | null> {
    const opportunity = await this.opportunityRepository.findOne({
      where: { id },
      relations: ['organisation', 'pipelineDefinition', 'pipelineStage'],
    });
    const affinityData = await this.affinityCacheService.getByDomain(
      opportunity.organisation.domains[0],
    );

    return {
      id: opportunity.id,
      organisation: {
        id: opportunity.organisationId,
        name: opportunity.organisation?.name,
        domains: opportunity.organisation?.domains,
      },
      stage: {
        displayName: opportunity.pipelineStage.displayName,
        order: opportunity.pipelineStage.order,
      },
      fields: affinityData.fields.map((field) => {
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
    });
    const affinityData = await this.affinityCacheService.getAll();

    const defaultDefinition = await this.getDefaultDefinition();
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
        const pipelineStage = await this.mapStage(
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

  public async create(
    opportunity: OpportunityEntity,
  ): Promise<OpportunityEntity> {
    return this.opportunityRepository.save(opportunity);
  }

  public async update(
    id: string,
    opportunity: OpportunityEntity,
  ): Promise<void> {
    await this.opportunityRepository.update(id, opportunity);
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
      },
      stage: {
        id: entity?.pipelineStage?.id,
        displayName: entity?.pipelineStage?.displayName,
        order: entity?.pipelineStage?.order,
        mappedFrom: entity?.pipelineStage?.mappedFrom,
      },
      fields: affinityDto.fields.map((field) => {
        return {
          displayName: field.displayName,
          value: field.value,
        };
      }),
    };
  }

  public async createFromAffinity(
    organisationId: string,
    opportunityAffinityInternalId: number,
  ): Promise<OpportunityData> {
    const affinityData = await this.affinityCacheService.get(
      opportunityAffinityInternalId.toString(),
    );

    const existingOpportunity = await this.opportunityRepository.findOne({
      where: {
        organisation: {
          domains: Like(`%${affinityData.organizationDto.domain}%`),
        },
      },
    });

    if (existingOpportunity) {
      return this.entityToData(existingOpportunity, affinityData);
    }

    const opportunity = new OpportunityEntity();
    opportunity.organisationId = organisationId;

    const pipelineDefinition = await this.getDefaultDefinition();
    const pipelineStage = await this.mapStage(
      pipelineDefinition,
      affinityData.stage.text,
    );
    opportunity.pipelineDefinitionId = pipelineDefinition.id;
    opportunity.pipelineStageId = pipelineStage.id;

    const entity = await this.opportunityRepository.save(opportunity);

    return this.entityToData(entity, affinityData);
  }

  public async ensureAllAffinityEntriesAsOpportunities(): Promise<void> {
    const affinityData = await this.affinityCacheService.getAll();

    const existingOpportunities = await this.opportunityRepository.find({
      relations: ['organisation'],
    });

    const nonexitstingAffinityData = affinityData.filter((affinity) => {
      return !existingOpportunities.some((opportunity) => {
        return opportunity.organisation.domains.some((domain) => {
          if (affinity?.organizationDto?.domains?.length === 0) return true;
          return affinity.organizationDto.domains.includes(domain);
        });
      });
    });

    const defaultDefinition = await this.getDefaultDefinition();

    for (const org of nonexitstingAffinityData) {
      const organisation =
        await this.organisationService.createFromAffinityOrGet(
          org.organizationDto.id,
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

      const pipelineStage = await this.mapStage(
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

  private async getDefaultDefinition(): Promise<PipelineDefinitionEntity> {
    const pipelineDefinitions = await this.pipelineRepository.find({
      relations: ['stages'],
    });
    return pipelineDefinitions[0];
  }

  private async mapStage(
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
}
