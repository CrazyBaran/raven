import { CompanyStatus } from 'rvns-shared';
import {
  AfterInsert,
  AfterLoad,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { PipelineDefinitionEntity } from './pipeline-definition.entity';

@Entity({ name: 'pipeline_stages' })
@Index(['id'], { unique: true })
export class PipelineStageEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => PipelineDefinitionEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pipeline_definition_id' })
  public pipelineDefinition: PipelineDefinitionEntity;

  @Column()
  @RelationId(
    (pipelineStage: PipelineStageEntity) => pipelineStage.pipelineDefinition,
  )
  public pipelineDefinitionId: string;

  @Column()
  public displayName: string;

  @Column()
  public mappedFrom: string;

  @Column()
  public order: number;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  public configuration: string;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  public showFields: string;

  @Column({ default: false })
  public isHidden: boolean;

  @Column({ default: false })
  public isDefault: boolean;

  @Column({
    nullable: true,
    default: null,
    enum: CompanyStatus,
    type: 'nvarchar',
    length: '30',
  })
  public relatedCompanyStatus: CompanyStatus | null;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
  }
}
