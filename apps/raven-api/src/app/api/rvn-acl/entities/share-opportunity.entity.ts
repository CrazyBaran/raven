import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';

import { OpportunityEntity } from '../../rvn-opportunities/entities/opportunity.entity';
import { ShareResourceCode } from '../enums/share-resource-code.enum';
import { AbstractShareEntity } from './abstract-share.entity';

@Entity({ name: 'shares_opportunities' })
export class ShareOpportunityEntity extends AbstractShareEntity {
  @Index()
  @ManyToOne(() => OpportunityEntity, (opportunity) => opportunity.shares, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'resource_id' })
  public resource: OpportunityEntity;

  @Column()
  @RelationId((share: ShareOpportunityEntity) => share.resource)
  public resourceId: string;

  public readonly resourceCode = ShareResourceCode.Opportunity;
}
