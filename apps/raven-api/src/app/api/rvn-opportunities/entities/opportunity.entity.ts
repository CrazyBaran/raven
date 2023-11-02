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
} from 'typeorm';
import { PipelineDefinitionEntity } from '../../rvn-pipeline/entities/pipeline-definition.entity';
import { PipelineStageEntity } from '../../rvn-pipeline/entities/pipeline-stage.entity';
import { TagEntity } from '../../rvn-tags/entities/tag.entity';
import { OrganisationEntity } from './organisation.entity';

@Entity({ name: 'opportunities' })
@Index(['id'], { unique: true })
export class OpportunityEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => OrganisationEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organisation_id' })
  public organisation: OrganisationEntity;

  @Column()
  @RelationId((opportunity: OpportunityEntity) => opportunity.organisation)
  public organisationId: string;

  @ManyToOne(() => PipelineDefinitionEntity, {
    nullable: false,
  })
  @JoinColumn({ name: 'pipeline_definition_id' })
  public pipelineDefinition: PipelineDefinitionEntity;

  @Column()
  @RelationId(
    (opportunity: OpportunityEntity) => opportunity.pipelineDefinition,
  )
  public pipelineDefinitionId: string;

  @ManyToOne(() => PipelineStageEntity, {
    nullable: false,
  })
  @JoinColumn({ name: 'pipeline_stage_id' })
  public pipelineStage: PipelineStageEntity;

  @Column()
  @RelationId((opportunity: OpportunityEntity) => opportunity.pipelineStage)
  public pipelineStageId: string;

  @ManyToOne(() => TagEntity, {
    nullable: true,
  })
  @JoinColumn({ name: 'tag_id' })
  public tag: TagEntity | null;

  @Column({
    nullable: true,
  })
  @RelationId((opportunity: OpportunityEntity) => opportunity.tag)
  public tagId: string | null;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
    this.organisationId = this.organisationId.toLowerCase();
    this.pipelineDefinitionId = this.pipelineDefinitionId.toLowerCase();
    this.pipelineStageId = this.pipelineStageId.toLowerCase();
  }
}
