import { Repository } from 'typeorm';

import { Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OpportunityEntity } from '../../rvn-opportunities/entities/opportunity.entity';

@Injectable()
export class GetOpportunityRelatedToDomainPipe
  implements PipeTransform<string, Promise<OpportunityEntity[] | null>>
{
  @InjectRepository(OpportunityEntity)
  protected readonly opportunityRepository: Repository<OpportunityEntity>;

  public async transform(domain: string): Promise<OpportunityEntity[] | null> {
    if (domain) {
      return await this.opportunityRepository
        .createQueryBuilder('opportunity')
        .innerJoin('opportunity.organisation', 'organisation')
        .where(`organisation.domains LIKE :domain`, { domain: `%${domain}%` })
        .getMany();
    }
    return null;
  }
}
