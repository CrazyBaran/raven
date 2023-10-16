import { Like, Repository } from 'typeorm';

import { Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganisationEntity } from '../entities/organisation.entity';

@Injectable()
export class FindOrganizationByDomainPipe
  implements PipeTransform<string, Promise<OrganisationEntity>>
{
  @InjectRepository(OrganisationEntity)
  protected readonly organizationRepository: Repository<OrganisationEntity | null>;

  public async transform(domain: string): Promise<OrganisationEntity | null> {
    const organisation = await this.organizationRepository.find({
      where: { domains: Like(`%${domain}%`) },
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
