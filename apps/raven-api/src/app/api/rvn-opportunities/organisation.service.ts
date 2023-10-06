import { OrganisationData } from '@app/rvns-opportunities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AffinityCacheService } from '../rvn-affinity-integration/cache/affinity-cache.service';
import { OrganisationEntity } from './entities/organisation.entity';

@Injectable()
export class OrganisationService {
  public constructor(
    @InjectRepository(OrganisationEntity)
    private readonly organisationRepository: Repository<OrganisationEntity>,
    private readonly affinityCacheService: AffinityCacheService,
  ) {}

  public async findAll(skip = 0, take = 10): Promise<OrganisationData[]> {
    const organisations = await this.organisationRepository.find();
    const affinityData = await this.affinityCacheService.getAll();

    const combinedData: OrganisationData[] = [];

    for (const organisation of organisations) {
      const matchedOrganization = affinityData.find((org) =>
        org.organizationDto.domains.includes(organisation.domains[0]),
      );

      const result: OrganisationData = {
        ...organisation,
        affinityInternalId: matchedOrganization?.organizationDto?.id,
      };

      combinedData.push(result);
    }

    for (const org of affinityData) {
      const isAlreadyIncluded = combinedData.some((data) =>
        data.domains.some((domain) =>
          org.organizationDto.domains.includes(domain),
        ),
      );

      if (!isAlreadyIncluded) {
        const result: OrganisationData = {
          affinityInternalId: org.organizationDto.id,
          id: undefined,
          name: org.organizationDto.name,
          domains: org.organizationDto.domains,
        };

        combinedData.push(result);
      }
    }

    return combinedData.slice(skip, skip + take);
  }

  public async findOne(id: string): Promise<OrganisationEntity> {
    return this.organisationRepository.findOne({ where: { id } });
  }

  public async create(
    organisation: OrganisationEntity,
  ): Promise<OrganisationEntity> {
    return this.organisationRepository.save(organisation);
  }

  public async update(
    id: string,
    organisation: OrganisationEntity,
  ): Promise<void> {
    await this.organisationRepository.update(id, organisation);
  }

  public async remove(id: string): Promise<void> {
    await this.organisationRepository.delete(id);
  }
}
