import { Repository } from 'typeorm';

import { Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OpportunityEntity } from '../../rvn-opportunities/entities/opportunity.entity';

@Injectable()
export class FindOpportunityByNotePipe
  implements PipeTransform<string | null, Promise<OpportunityEntity>>
{
  @InjectRepository(OpportunityEntity)
  protected readonly opportunityRepository: Repository<OpportunityEntity>;

  public async transform(
    noteId: string | null,
  ): Promise<OpportunityEntity | null> {
    if (!noteId) {
      return null;
    }
    const opportunity = await this.opportunityRepository.findOne({
      where: { note: { id: noteId } },
    });

    return opportunity;
  }
}
