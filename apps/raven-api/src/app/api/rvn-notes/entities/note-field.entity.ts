import {
  AfterInsert,
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

import { AuditableEntity } from '../../../shared/interfaces/auditable.interface';
import { UserEntity } from '../../rvn-users/entities/user.entity';
import { NoteFieldGroupEntity } from './note-field-group.entity';

@Entity({ name: 'note_fields' })
@Index(['id', 'noteGroup'], { unique: true })
export class NoteFieldEntity implements AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 50 })
  public name: string;

  @Column({ length: 50 })
  public type: string;

  @Column()
  public order: number;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  public value: string | null;

  @Column()
  public templateFieldId: string | null; // TODO nullable or set some kind of default for pre-existing data? generated UUID won't be even caught when filtering so it's not an issue

  @ManyToOne(() => NoteFieldGroupEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'note_group_id' })
  public noteGroup: NoteFieldGroupEntity;

  @Column({ nullable: false })
  @RelationId((nfd: NoteFieldEntity) => nfd.noteGroup)
  public noteGroupId: string;

  @Index()
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'created_by_id' })
  public createdBy: UserEntity;

  @Column()
  @RelationId((fd: NoteFieldEntity) => fd.createdBy)
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
  @RelationId((t: NoteFieldEntity) => t.updatedBy)
  public updatedById: string;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
    this.noteGroupId = this.noteGroupId.toLowerCase();
    this.createdById = this.createdById.toLowerCase();
    this.updatedById = this.updatedById.toLowerCase();
  }
}
