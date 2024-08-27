import { plainToInstance } from 'class-transformer';
import {
  AfterInsert,
  AfterLoad,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from '../../rvn-users/entities/user.entity';
import { FundManagerEntity } from './fund-manager.entity';

@Entity('fund_manager_key_relationship')
export class FundManagerKeyRelationshipEntity {
  @PrimaryColumn({ name: 'fund_manager_id' })
  @Index()
  public fundManagerId: string;

  @PrimaryColumn({ name: 'user_id' })
  @Index()
  public userId: string;

  @ManyToOne(() => FundManagerEntity, (manager) => manager.keyRelationships, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'fund_manager_id', referencedColumnName: 'id' }])
  public fundManagers: FundManagerEntity[];

  @ManyToOne(() => UserEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  public users: UserEntity[];

  public static create(
    partial: Partial<FundManagerKeyRelationshipEntity>,
  ): FundManagerKeyRelationshipEntity {
    return plainToInstance(FundManagerKeyRelationshipEntity, partial);
  }

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.fundManagerId = this.fundManagerId?.toLowerCase();
    this.userId = this.userId?.toLowerCase();
  }
}
