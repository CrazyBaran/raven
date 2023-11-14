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
import { FieldDefinitionEntity } from './field-definition.entity';
import { TabEntity } from './tab.entity';
import { TemplateEntity } from './template.entity';

@Entity({ name: 'field_groups' })
@Index(['id', 'template'], { unique: true })
export class FieldGroupEntity implements AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 50 })
  public name: string;

  @Column()
  public order: number;

  @OneToMany(() => FieldDefinitionEntity, (fd) => fd.group, { eager: true })
  public fieldDefinitions: FieldDefinitionEntity[];

  @ManyToOne(() => TemplateEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'template_id' })
  public template: TemplateEntity;

  @Column()
  @RelationId((t: FieldGroupEntity) => t.template)
  public templateId: string;

  @ManyToOne(() => TabEntity, { nullable: true })
  @JoinColumn({ name: 'tab_id' })
  public tab: TabEntity | null;

  @Column({ nullable: true })
  @RelationId((t: FieldGroupEntity) => t.tab)
  public tabId: string | null;

  @Index()
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'created_by_id' })
  public createdBy: UserEntity;

  @Column()
  @RelationId((t: FieldGroupEntity) => t.createdBy)
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
    this.templateId = this.templateId.toLowerCase();
    this.tabId = this.tabId?.toLowerCase() || null;
    this.createdById = this.createdById.toLowerCase();
  }
}
