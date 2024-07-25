import {
  AfterInsert,
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { PipelineDefinitionEntity } from './pipeline-definition.entity';

@Entity({ name: 'pipeline_views' })
export class PipelineViewEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column({ type: 'smallint' })
  public order: number;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: false })
  public columnsConfig: string;

  @ManyToOne(() => PipelineDefinitionEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pipeline_definition_id' })
  public pipelineDefinition: PipelineDefinitionEntity;

  @Column()
  @RelationId(
    (pipelineView: PipelineViewEntity) => pipelineView.pipelineDefinition,
  )
  public pipelineDefinitionId: string;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
  }
}
