import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { FundManagerEntity } from '../entities/fund-manager.entity';

export class ParseFundManagerPipe extends AbstractEntityPipe<FundManagerEntity> {
  public readonly entityClass = FundManagerEntity;
  public readonly resource = 'fund_manager';
  // public readonly relations = ['organisations'];
}
