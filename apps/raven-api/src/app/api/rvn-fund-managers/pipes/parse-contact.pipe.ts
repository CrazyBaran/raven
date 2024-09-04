import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { FundManagerContactEntity } from '../entities/fund-manager-contact.entity';

export class ParseContactPipe extends AbstractEntityPipe<FundManagerContactEntity> {
  public readonly entityClass = FundManagerContactEntity;
  public readonly resource = 'fund_manager_contact';
}
