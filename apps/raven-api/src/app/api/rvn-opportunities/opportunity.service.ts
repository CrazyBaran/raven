import { OpportunityData } from '@app/rvns-opportunities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { AffinityCacheService } from '../rvn-affinity-integration/cache/affinity-cache.service';
import { OrganizationStageDto } from '../rvn-affinity-integration/dtos/organisation-stage.dto';
import { OpportunityEntity } from './entities/opportunity.entity';

@Injectable()
export class OpportunityService {
  public constructor(
    @InjectRepository(OpportunityEntity)
    private readonly opportunityRepository: Repository<OpportunityEntity>,
    private readonly affinityCacheService: AffinityCacheService,
  ) {}

  public async findAll(skip = 0, take = 10): Promise<OpportunityData[]> {
    const opportunities = await this.opportunityRepository.find();
    const affinityData = await this.affinityCacheService.getAll();

    const combinedData: OpportunityData[] = [];

    for (const opportunity of opportunities) {
      const matchedOrganization = affinityData.find((org) =>
        org.organizationDto.domains.includes(
          opportunity.organisation.domains[0],
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
          displayName: opportunity.pipelineStage.displayName,
          order: opportunity.pipelineStage.order,
        },
      };

      combinedData.push(result);
    }

    for (const org of affinityData) {
      const isAlreadyIncluded = combinedData.some((data) =>
        data.organisation.domains.some((domain) =>
          org.organizationDto.domains.includes(domain),
        ),
      );

      if (!isAlreadyIncluded) {
        const result: OpportunityData = {
          id: undefined,
          organisation: {
            affinityInternalId: org.organizationDto.id,
            id: undefined,
            name: org.organizationDto.name,
            domains: org.organizationDto.domains,
          },
          stage: {
            displayName: undefined,
            order: undefined,
          },
        };

        combinedData.push(result);
      }
    }

    return combinedData.slice(skip, skip + take);
  }

  public async findOne(id: string): Promise<OpportunityData | null> {
    const opportunity = await this.opportunityRepository.findOne({
      where: { id },
    });

    return {
      id: opportunity.id,
      organisation: {
        id: opportunity.organisationId,
        name: opportunity.organisation.name,
        domains: opportunity.organisation.domains,
      },
      stage: {
        displayName: opportunity.pipelineStage.displayName,
        order: opportunity.pipelineStage.order,
      },
    } as OpportunityData;
  }

  public async findByDomain(domain: string): Promise<OpportunityData[]> {
    const opportunities = await this.opportunityRepository.find({
      where: { organisation: { domains: Like(`%${domain}%`) } },
    });
    const affinityData = await this.affinityCacheService.getAll();

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
        const result: OpportunityData = {
          id: undefined, // You might need to adjust this if there's a relevant ID
          organisation: {
            affinityInternalId: matchedOrganization.organizationDto.id,
            id: undefined, // Adjust this if there's a relevant ID
            name: matchedOrganization.organizationDto.name,
            domains: matchedOrganization.organizationDto.domains,
          },
          stage: {
            displayName: undefined,
            order: undefined,
          },
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
        displayName: entity?.pipelineStage?.displayName,
        order: entity?.pipelineStage?.order,
      },
    };
  }
}
