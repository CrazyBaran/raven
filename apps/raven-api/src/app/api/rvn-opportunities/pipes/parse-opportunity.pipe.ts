import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { OpportunityEntity } from '../entities/opportunity.entity';

export class ParseOpportunityPipe extends AbstractEntityPipe<OpportunityEntity> {
  public readonly entityClass = OpportunityEntity;
  public readonly resource = 'opportunity';
}
