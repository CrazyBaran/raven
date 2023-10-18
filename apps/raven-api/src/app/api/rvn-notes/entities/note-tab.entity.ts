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
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

import { AuditableEntity } from '../../../shared/interfaces/auditable.interface';
import { UserEntity } from '../../rvn-users/entities/user.entity';
import { NoteFieldGroupEntity } from './note-field-group.entity';
import { NoteEntity } from './note.entity';

@Entity({ name: 'note_tabs' })
@Index(['id', 'note'], { unique: true })
export class NoteTabEntity implements AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 50 })
  public name: string;

  @Column()
  public order: number;

  @OneToMany(() => NoteFieldGroupEntity, (nfg) => nfg.noteTab, {
    eager: true,
    cascade: ['insert'],
  })
  public noteFieldGroups: NoteFieldGroupEntity[];

  @ManyToOne(() => NoteEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'note_id' })
  public note: NoteEntity;

  @Column()
  @RelationId((t: NoteTabEntity) => t.note)
  public noteId: string;

  @Index()
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'created_by_id' })
  public createdBy: UserEntity;

  @Column()
  @RelationId((t: NoteTabEntity) => t.createdBy)
  public createdById: string;

  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @RelationId((t: NoteTabEntity) => t.updatedBy)
  public updatedById: string;

  @Index()
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'updated_by_id' })
  public updatedBy: UserEntity;

  @Index()
  @UpdateDateColumn()
  public updatedAt: Date;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
    this.noteId = this.noteId.toLowerCase();
    this.createdById = this.createdById.toLowerCase();
  }
}
