import { ShortlistType } from 'rvns-shared';
import {
  AfterInsert,
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { OrganisationEntity } from '../../rvn-opportunities/entities/organisation.entity';
import { UserEntity } from '../../rvn-users/entities/user.entity';
@Entity('shortlist')
@Index(['id'], { unique: true })
export class ShortlistEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'nvarchar', length: '256', nullable: false })
  public name: string;

  @Column({ type: 'nvarchar', length: '1000', nullable: true })
  public description: string;

  @Column({
    nullable: false,
    default: ShortlistType.CUSTOM,
    enum: ShortlistType,
    type: 'nvarchar',
    length: '30',
  })
  public type: ShortlistType;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'creator_id' })
  public creator: UserEntity;

  @Column({ nullable: true })
  @RelationId((t: ShortlistEntity) => t.creator)
  public creatorId: string | null;

  @ManyToMany(
    () => OrganisationEntity,
    (organisation) => organisation.shortlists,
    { cascade: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinTable({
    name: 'shortlist_organisation',
    joinColumn: {
      name: 'shortlist_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'organisation_id',
      referencedColumnName: 'id',
    },
  })
  public organisations?: OrganisationEntity[];

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public updatedAt: Date;

  public inPipelineCount: number;

  public organisationsCount: number;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
    this.creatorId = this.creatorId?.toLowerCase() || null;
  }
}
