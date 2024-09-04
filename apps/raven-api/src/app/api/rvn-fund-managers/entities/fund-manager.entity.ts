import { Currency, FundManagerRelationStrength } from 'rvns-shared';
import {
  AfterInsert,
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrganisationEntity } from '../../rvn-opportunities/entities/organisation.entity';
import { TagEntity } from '../../rvn-tags/entities/tag.entity';
import { UserEntity } from '../../rvn-users/entities/user.entity';
import { FundManagerContactEntity } from './fund-manager-contact.entity';

@Entity('fund_manager')
@Index(['id'], { unique: true })
export class FundManagerEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'nvarchar', length: '256', nullable: false })
  public name: string;

  @Column({ type: 'nvarchar', length: '512', nullable: true })
  public domain: string | null;

  @Column({ type: 'nvarchar', length: '1000', nullable: true })
  public description: string | null;

  @Column({ type: 'nvarchar', length: '1000', nullable: true })
  public strategy: string | null;

  @Column({ type: 'nvarchar', length: '1000', nullable: true })
  public geography: string | null;

  @Column({ type: 'bigint', nullable: true })
  public avgCheckSize: number | null;

  @Column({
    nullable: true,
    default: null,
    enum: Currency,
    type: 'nvarchar',
    length: '3',
  })
  public avgCheckSizeCurrency: Currency | null;

  @Column({ type: 'bigint', nullable: true })
  public aum: number | null;

  @Column({
    nullable: true,
    default: null,
    enum: Currency,
    type: 'nvarchar',
    length: '3',
  })
  public aumCurrency: Currency | null;

  @Column({ default: false })
  public isPortfolio: boolean;

  @ManyToMany(
    () => OrganisationEntity,
    (organisation) => organisation.fundManagers,
    { cascade: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinTable({
    name: 'fund_manager_organisation',
    joinColumn: {
      name: 'fund_manager_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'organisation_id',
      referencedColumnName: 'id',
    },
  })
  public organisations?: OrganisationEntity[];

  @ManyToMany(() => UserEntity, {
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'fund_manager_key_relationship',
    joinColumn: {
      name: 'fund_manager_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  public keyRelationships?: UserEntity[];

  @ManyToMany(() => TagEntity, {
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'fund_manager_industry',
    joinColumn: { name: 'fund_manager_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  public industryTags?: TagEntity[];

  @Column({
    nullable: true,
    default: null,
    enum: FundManagerRelationStrength,
    type: 'nvarchar',
    length: '60',
  })
  public relationStrength: FundManagerRelationStrength;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public updatedAt: Date;

  @OneToMany(
    (type) => FundManagerContactEntity,
    (contact) => contact.fundManager,
  )
  public contacts: FundManagerContactEntity[];

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
  }
}
