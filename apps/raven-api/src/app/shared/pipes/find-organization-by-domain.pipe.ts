import { Repository } from 'typeorm';

import { Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganisationEntity } from '../../api/rvn-opportunities/entities/organisation.entity';

@Injectable()
export class FindOrganizationByDomainPipe
  implements PipeTransform<string | undefined, Promise<OrganisationEntity>>
{
  @InjectRepository(OrganisationEntity)
  protected readonly organizationRepository: Repository<OrganisationEntity>;

  public async transform(domain?: string): Promise<OrganisationEntity | null> {
    if (!domain) {
      return null;
    }
    const organisation = await this.organizationRepository.find({
      relations: ['organisationDomains'],
      where: { organisationDomains: { domain: domain } },
    });

    if (organisation.length > 1) {
      throw new Error(
        'More than one organisation found for given domain. Invalid configuration!',
      );
    }
    if (organisation.length === 1) {
      return organisation[0];
    }
    return null;
  }
}
