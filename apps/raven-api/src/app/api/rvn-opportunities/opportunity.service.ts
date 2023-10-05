import { OpportunityData } from '@app/rvns-opportunities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AffinityCacheService } from '../rvn-affinity-integration/cache/affinity-cache.service';
import { OpportunityEntity } from './entities/opportunity.entity';

@Injectable()
export class OpportunityService {
  public constructor(
    @InjectRepository(OpportunityEntity)
    private readonly opportunityRepository: Repository<OpportunityEntity>,
    private readonly affinityCacheService: AffinityCacheService,
  ) {}

  public async findAll(skip = 0, take = 10): Promise<OpportunityData[]> {
    // Fetch data from the OpportunityEntity repository with a join on OrganisationEntity
    const opportunities = await this.opportunityRepository.find({
      skip: skip,
      take: take,
    });

    // Map OpportunityEntity and its related OrganisationEntity to OpportunityData
    const mappedOpportunities = opportunities.map((opportunity) => ({
      id: opportunity.id,
      organisation: {
        id: opportunity.organisation.id, // Adjust based on the actual structure
        name: opportunity.organisation.name,
        domains: opportunity.organisation.domains,
      },
      stage: {
        status: 'Unknown', // Placeholder value since OpportunityEntity doesn't have a stage
      },
      createdById: 'defaultUserId', // Placeholder value
      updatedAt: new Date(), // Placeholder value
      createdAt: new Date(), // Placeholder value
    }));

    // Fetch data from the AffinityCacheService
    const affinityData = await this.affinityCacheService.getAll(skip, take);

    // Map OrganizationStageDto to OpportunityData
    const mappedAffinityData = affinityData.map((data) => ({
      id: data.organizationDto.id.toString(),
      organisation: {
        id: data.organizationDto.id.toString(),
        name: data.organizationDto.name,
        domains: data.organizationDto.domains,
      },
      stage: {
        status: data.stage?.text || 'Unknown',
      },
      createdById: 'defaultUserId', // Placeholder value
      updatedAt: new Date(), // Placeholder value
      createdAt: new Date(), // Placeholder value
    }));

    // Combine the data
    const combinedData = [...mappedOpportunities, ...mappedAffinityData];

    return combinedData;
  }

  public async findOne(id: string): Promise<OpportunityEntity> {
    return this.opportunityRepository.findOne({
      where: { id },
    });
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
}
