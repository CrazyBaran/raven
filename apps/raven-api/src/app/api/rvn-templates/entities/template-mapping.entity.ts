import {
  AfterInsert,
  AfterLoad,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

import { PipelineStageEntity } from '../../rvn-pipeline/entities/pipeline-stage.entity';
import { FieldDefinitionEntity } from './field-definition.entity';
import { TabEntity } from './tab.entity';

@Entity({ name: 'template_mapping' })
@Index(['id'], { unique: true })
export class TemplateMappingEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index()
  @ManyToOne(() => TabEntity)
  @JoinColumn({ name: 'tab_id' })
  public tab: TabEntity;

  @Column()
  @RelationId((t: TemplateMappingEntity) => t.tab)
  public tabId: string;

  @Index()
  @ManyToOne(() => TabEntity)
  @JoinColumn({ name: 'field_definition_id' })
  public fieldDefinition: FieldDefinitionEntity;

  @Column()
  @RelationId((t: TemplateMappingEntity) => t.fieldDefinition)
  public fieldDefinitionId: string;

  @ManyToMany(() => PipelineStageEntity, { eager: true })
  @JoinTable({
    name: 'template_mapping_pipeline_stage',
    joinColumn: { name: 'template_mapping_id' },
    inverseJoinColumn: { name: 'pipeline_stage_id' },
  })
  public pipelineStages: PipelineStageEntity[];

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
    this.fieldDefinitionId = this.fieldDefinitionId.toLowerCase();
    this.tabId = this.tabId.toLowerCase();
  }
}
