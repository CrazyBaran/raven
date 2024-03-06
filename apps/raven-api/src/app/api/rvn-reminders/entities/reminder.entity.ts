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
import { ComplexTagEntity } from '../../rvn-tags/entities/complex-tag.entity';
import { UserEntity } from '../../rvn-users/entities/user.entity';

@Entity('reminder')
@Index(['id'], { unique: true })
export class ReminderEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'nvarchar', length: '256', nullable: false })
  public name: string;

  @Column({ type: 'nvarchar', length: '1000', nullable: true })
  public description: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'creator_id' })
  public creator: UserEntity;

  @Column({ nullable: true })
  @RelationId((t: ReminderEntity) => t.creator)
  public creatorId: string | null;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'assigned_by_id' })
  public assignedBy: UserEntity;

  @Column({ nullable: true })
  @RelationId((t: ReminderEntity) => t.assignedBy)
  public assignedById: string | null;

  @ManyToMany(() => UserEntity, {
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'reminder_assignee',
    joinColumn: {
      name: 'reminder_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  public assignees?: UserEntity[];

  @ManyToOne(() => ComplexTagEntity, { nullable: true })
  @JoinColumn({ name: 'tag_id' })
  public tag: ComplexTagEntity | null;

  @Column({ nullable: true })
  @RelationId((t: ReminderEntity) => t.tag)
  public tagId: string | null;

  @Index()
  @Column({ nullable: false, type: 'datetime' })
  public dueDate: Date;

  @Column({ nullable: true, type: 'datetime', default: null })
  public completedDate: Date | null;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public updatedAt: Date;

  public completed: boolean;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
    this.creatorId = this.creatorId?.toLowerCase() || null;
    this.tagId = this.tagId?.toLowerCase() || null;
  }
}
