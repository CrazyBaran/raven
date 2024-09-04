import { plainToInstance } from 'class-transformer';
import { FundManagerContactStrength } from 'rvns-shared';
import {
  AfterInsert,
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { FundManagerEntity } from './fund-manager.entity';

@Entity('fund_manager_contact')
export class FundManagerContactEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'nvarchar', length: '256', nullable: false })
  public name: string;

  @Column({ type: 'nvarchar', length: '256', nullable: false })
  public position: string;

  @Column({
    nullable: true,
    default: null,
    enum: FundManagerContactStrength,
    type: 'nvarchar',
    length: '60',
  })
  public relationStrength: FundManagerContactStrength;

  @Column({ type: 'nvarchar', length: '512', nullable: false })
  public email: string;

  @Column({ type: 'nvarchar', length: '512', nullable: false })
  public linkedin: string;

  @Column()
  @RelationId((contact: FundManagerContactEntity) => contact.fundManager)
  public fundManagerId: string;

  @ManyToOne(() => FundManagerEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fund_manager_id' })
  public fundManager: FundManagerEntity;

  public static create(
    partial: Partial<FundManagerContactEntity>,
  ): FundManagerContactEntity {
    return plainToInstance(FundManagerContactEntity, partial);
  }

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
    this.fundManagerId = this.fundManagerId.toLowerCase();
  }
}
