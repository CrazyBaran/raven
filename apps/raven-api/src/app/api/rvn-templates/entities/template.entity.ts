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
import { UserEntity } from '../../rvn-users/entities/user.entity';
import { FieldGroupEntity } from './field-group.entity';
import { TabEntity } from './tab.entity';

@Entity({ name: 'templates' })
@Index(['id'], { unique: true })
export class TemplateEntity implements AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 50, default: 'note' })
  public type: string;

  @Column({ length: 50 })
  public name: string;

  @Column()
  public version: number;

  @OneToOne(() => TemplateEntity)
  @JoinColumn({ name: 'previous_version_id' })
  public previousVersion: TemplateEntity | null;

  @Column({ nullable: true })
  @RelationId((t: TemplateEntity) => t.previousVersion)
  public previousVersionId: string | null;

  @OneToMany(() => FieldGroupEntity, (fg) => fg.template, { eager: true })
  public fieldGroups: FieldGroupEntity[];

  @OneToMany(() => TabEntity, (t) => t.template, { eager: true })
  public tabs: TabEntity[];

  @Index()
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'created_by_id' })
  public createdBy: UserEntity;

  @Column()
  @RelationId((t: TemplateEntity) => t.createdBy)
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
    this.previousVersionId = this.previousVersionId?.toLowerCase();
    this.createdById = this.createdById.toLowerCase();
  }
}
