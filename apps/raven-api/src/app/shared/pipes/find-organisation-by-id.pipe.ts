import { Repository } from 'typeorm';

import { Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganisationEntity } from '../../api/rvn-opportunities/entities/organisation.entity';

@Injectable()
export class FindOrganizationByIdPipe
  implements PipeTransform<string | undefined, Promise<OrganisationEntity>>
{
  @InjectRepository(OrganisationEntity)
  protected readonly organizationRepository: Repository<OrganisationEntity>;

  public async transform(
    organisationId?: string,
  ): Promise<OrganisationEntity | null> {
    if (!organisationId) {
      return null;
    }
    const organisation = await this.organizationRepository.findOne({
      where: { id: organisationId },
    });

    return organisation ?? null;
  }
}
