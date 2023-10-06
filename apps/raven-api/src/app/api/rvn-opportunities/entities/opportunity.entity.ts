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
import { PipelineDefinitionEntity } from '../../rvn-pipeline/entities/pipeline-definition.entity';
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

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
  }
}
