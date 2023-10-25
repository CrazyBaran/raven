import { OrganisationData } from '@app/rvns-opportunities';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { AffinityCacheService } from '../rvn-affinity-integration/cache/affinity-cache.service';
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
    private readonly affinityCacheService: AffinityCacheService,
    private readonly eventEmitter: EventEmitter2,
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

  public async createFromAffinityOrGet(
    domains: string[],
  ): Promise<OrganisationEntity> {
    const affinityData = await this.affinityCacheService.getByDomains(domains);

    if (
      !affinityData?.organizationDto?.domains ||
      affinityData.organizationDto.domains.length === 0
    ) {
      return null;
    }
    const existingOrganisation = await this.organisationRepository.findOne({
      where: { domains: Like(`%${affinityData.organizationDto.domain}%`) },
    });

    if (existingOrganisation) {
      return existingOrganisation;
    }

    const organisation = new OrganisationEntity();
    organisation.name = affinityData.organizationDto.name;
    organisation.domains = affinityData.organizationDto.domains;

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
}
