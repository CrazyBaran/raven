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

import { UserEntity } from '../../rvn-users/entities/user.entity';
import { AuditableEntity } from '../../../shared/interfaces/auditable.interface';
import { NoteEntity } from './note.entity';
import { NoteFieldEntity } from './note-field.entity';

@Entity({ name: 'note_field_groups' })
@Index(['id', 'note'], { unique: true })
export class NoteFieldGroupEntity implements AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 50 })
  public name: string;

  @Column()
  public order: number;

  @OneToMany(() => NoteFieldEntity, (nfd) => nfd.noteGroup, {
    eager: true,
  })
  public noteFields: NoteFieldEntity[];

  @ManyToOne(() => NoteEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'note_id' })
  public note: NoteEntity;

  @Column()
  @RelationId((t: NoteFieldGroupEntity) => t.note)
  public noteId: string;

  @Index()
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'created_by_id' })
  public createdBy: UserEntity;

  @Column()
  @RelationId((t: NoteFieldGroupEntity) => t.createdBy)
  public createdById: string;

  @CreateDateColumn()
  public createdAt: Date;

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
