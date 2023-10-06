import {
  AfterInsert,
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

import { AuditableEntity } from '../../../shared/interfaces/auditable.interface';
import { OpportunityEntity } from '../../rvn-opportunities/entities/opportunity.entity';
import { UserEntity } from '../../rvn-users/entities/user.entity';
import { NoteFieldGroupEntity } from './note-field-group.entity';

@Entity({ name: 'notes' })
@Index(['id', 'opportunity'], { unique: true })
export class NoteEntity implements AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 50 })
  public name: string;

  @Column()
  public version: number;

  @OneToOne(() => NoteEntity)
  @JoinColumn({ name: 'previous_version_id' })
  public previousVersion: NoteEntity | null;

  @Column({ nullable: true })
  @RelationId((n: NoteEntity) => n.previousVersion)
  public previousVersionId: string | null;

  @OneToMany(() => NoteFieldGroupEntity, (nfg) => nfg.note, {
    eager: true,
    cascade: ['insert'],
  })
  public noteFieldGroups: NoteFieldGroupEntity[];

  @Index()
  @ManyToOne(() => OpportunityEntity, { nullable: true })
  @JoinColumn({ name: 'opportunity_id' })
  public opportunity: OpportunityEntity | null;

  @Column({ nullable: true })
  @RelationId((t: NoteEntity) => t.opportunity)
  public opportunityId: string;

  @Index()
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'created_by_id' })
  public createdBy: UserEntity;

  @Column()
  @RelationId((t: NoteEntity) => t.createdBy)
  public createdById: string;

  @CreateDateColumn()
  public createdAt: Date;

  @Index()
  @UpdateDateColumn()
  public updatedAt: Date;

  @Index()
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'updated_by_id' })
  public updatedBy: UserEntity;

  @Column()
  @RelationId((t: NoteEntity) => t.updatedBy)
  public updatedById: string;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
    this.previousVersionId = this.previousVersionId?.toLowerCase();
    this.createdById = this.createdById.toLowerCase();
    this.updatedById = this.updatedById.toLowerCase();
  }
}
