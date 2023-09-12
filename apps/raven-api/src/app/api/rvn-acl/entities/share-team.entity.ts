import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';

import { TeamEntity } from '../../rvn-teams/entities/team.entity';
import { ShareResourceCode } from '../enums/share-resource-code.enum';
import { AbstractShareEntity } from './abstract-share.entity';

@Entity({ name: 'shares_teams' })
@Index(['actor'], { unique: true })
export class ShareTeamEntity extends AbstractShareEntity {
  @Index()
  @ManyToOne(() => TeamEntity, (team) => team.shares, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'resource_id' })
  public resource: TeamEntity;

  @Column()
  @RelationId((s: ShareTeamEntity) => s.resource)
  public resourceId: string;

  public readonly resourceCode = ShareResourceCode.Team;
}
