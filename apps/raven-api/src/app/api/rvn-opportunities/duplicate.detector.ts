import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DomainResolver } from '../rvn-utils/domain.resolver';
import { OrganisationDomainEntity } from './entities/organisation-domain.entity';
import { OrganisationEntity } from './entities/organisation.entity';

export class DuplicatesDto {
  public count: number;
  public duplicates: DuplicateDto[];
}

export class DuplicateDto {
  public domain: string;
  public canRemove: string[];
  public cannotRemove: {
    organisation: string;
    reasons: string[];
  }[];
}

@Injectable()
export class DuplicateDetector {
  public constructor(
    @InjectRepository(OrganisationDomainEntity)
    private readonly organisationDomainRepository: Repository<OrganisationDomainEntity>,
    @InjectRepository(OrganisationEntity)
    private readonly organisationRepository: Repository<OrganisationEntity>,
    private readonly domainResolver: DomainResolver,
  ) {}

  public async getDuplicates(): Promise<DuplicatesDto> {
    const domains = await this.organisationDomainRepository.find();

    const domainMap: { [key: string]: string[] } = {};
    for (const domain of domains) {
      const domainName = this.domainResolver.cleanDomain(domain.domain);
      if (domainMap[domainName]) {
        domainMap[domainName].push(domain.organisationId);
      } else {
        domainMap[domainName] = [domain.organisationId];
      }
    }

    const duplicates: DuplicatesDto = {
      count: 0,
      duplicates: [],
    };

    for (const domain in domainMap) {
      if (domainMap[domain].length > 1) {
        duplicates.count += 1;
        duplicates.duplicates.push(
          await this.getDuplicate(domain, domainMap[domain]),
        );
      }
    }

    return duplicates;
  }

  public async getDuplicate(
    domain: string,
    organisationIds: string[],
  ): Promise<DuplicateDto> {
    const duplicate: DuplicateDto = {
      domain: domain,
      canRemove: [],
      cannotRemove: [],
    };

    const organisations = await this.organisationRepository.find({
      where: { id: In(organisationIds) },
      relations: ['opportunities', 'shortlists', 'organisationDomains'],
    });

    for (const organisation of organisations) {
      const reasons: string[] = [];
      if (organisation.opportunities.length > 0) {
        reasons.push('Has opportunities');
      }
      if (organisation.shortlists.length > 0) {
        reasons.push('Is in shortlists');
      }
      if (organisation.sharepointDirectoryId) {
        reasons.push('Has sharepoint directory');
      }

      if (reasons.length === 0) {
        duplicate.canRemove.push(organisation.id);
      } else {
        duplicate.cannotRemove.push({
          organisation: organisation.id,
          reasons: reasons,
        });
      }
    }

    return duplicate;
  }

  public async fixDomains(): Promise<void> {
    const chunkSize = 1000;
    const count = await this.organisationDomainRepository.count();
    const chunks = Math.ceil(count / chunkSize);
    for (let i = 0; i < chunks; i++) {
      const domains = await this.organisationDomainRepository.find({
        skip: i * chunkSize,
        take: chunkSize,
      });
      const domainsToCreate: OrganisationDomainEntity[] = [];
      const domainsToDelete: OrganisationDomainEntity[] = [];
      for (const domain of domains) {
        const cleanedDomain = this.domainResolver.cleanDomain(domain.domain);
        if (cleanedDomain !== domain.domain) {
          domainsToDelete.push(domain);
          const newDomain = this.organisationDomainRepository.create({
            organisationId: domain.organisationId,
            domain: cleanedDomain,
          });
          domainsToCreate.push(newDomain);
        }
      }
      await this.organisationDomainRepository.remove(domainsToDelete);
      await this.organisationDomainRepository.save(domainsToCreate);
    }
  }
}
