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
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

import { AuditableEntity } from '../../../shared/interfaces/auditable.interface';
import { PipelineStageEntity } from '../../rvn-pipeline/entities/pipeline-stage.entity';
import { UserEntity } from '../../rvn-users/entities/user.entity';
import { FieldDefinitionEntity } from './field-definition.entity';
import { FieldGroupEntity } from './field-group.entity';
import { TemplateEntity } from './template.entity';

@Entity({ name: 'tabs' })
@Index(['id', 'template'], { unique: true })
export class TabEntity implements AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 50 })
  public name: string;

  @Column()
  public order: number;

  @OneToMany(() => FieldGroupEntity, (fg) => fg.tab, { eager: true })
  public fieldGroups: FieldGroupEntity[];

  @ManyToOne(() => TemplateEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'template_id' })
  public template: TemplateEntity;

  @Column()
  @RelationId((t: TabEntity) => t.template)
  public templateId: string;

  @ManyToMany(() => PipelineStageEntity, {
    eager: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'tab_pipeline_stage',
    joinColumn: { name: 'tab_id' },
    inverseJoinColumn: { name: 'pipeline_stage_id' },
  })
  public pipelineStages: PipelineStageEntity[];

  // these are not field definitions from same template, rather than fields from other templates used for mapping due diligence
  @ManyToMany(() => FieldDefinitionEntity, {
    eager: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'tab_related_field',
    joinColumn: { name: 'tab_id' },
    inverseJoinColumn: { name: 'field_definition_id' },
  })
  public relatedFields: FieldDefinitionEntity[];

  @ManyToMany(() => TemplateEntity, {
    eager: false, // cannot set this to true because of circular reference
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'tab_related_template',
    joinColumn: { name: 'tab_id' },
    inverseJoinColumn: { name: 'template_id' },
  })
  public relatedTemplates: TemplateEntity[];

  @Index()
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'created_by_id' })
  public createdBy: UserEntity;

  @Column()
  @RelationId((t: TabEntity) => t.createdBy)
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
    this.createdById = this.createdById.toLowerCase();
  }
}
