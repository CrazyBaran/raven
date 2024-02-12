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
import { SharepointEnabledEntity } from '../../../shared/interfaces/sharepoint-enabled-entity.interface';
import { ShareResource } from '../../rvn-acl/contracts/share-resource.interface';
import { ShareOpportunityEntity } from '../../rvn-acl/entities/share-opportunity.entity';
import { FileEntity } from '../../rvn-files/entities/file.entity';
import { NoteEntity } from '../../rvn-notes/entities/note.entity';
import { PipelineDefinitionEntity } from '../../rvn-pipeline/entities/pipeline-definition.entity';
import { PipelineStageEntity } from '../../rvn-pipeline/entities/pipeline-stage.entity';
import {
  TagEntity,
  VersionTagEntity,
} from '../../rvn-tags/entities/tag.entity';
import { OrganisationEntity } from './organisation.entity';

@Entity({ name: 'opportunities' })
@Index(['id'], { unique: true })
export class OpportunityEntity
  implements ShareResource, SharepointEnabledEntity
{
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

  @ManyToOne(() => PipelineStageEntity, {
    nullable: true,
  })
  @JoinColumn({ name: 'previous_pipeline_stage_id' })
  public previousPipelineStage: PipelineStageEntity | null;

  @Column({
    nullable: true,
  })
  @RelationId(
    (opportunity: OpportunityEntity) => opportunity.previousPipelineStage,
  )
  public previousPipelineStageId: string | null;

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

  @ManyToOne(() => TagEntity, {
    nullable: true,
  })
  @JoinColumn({ name: 'version_tag_id' })
  public versionTag: VersionTagEntity | null;

  @Column({
    nullable: true,
  })
  @RelationId((opportunity: OpportunityEntity) => opportunity.versionTag)
  public versionTagId: string | null;

  @OneToMany(() => FileEntity, (file) => file.opportunity)
  public files: FileEntity[];

  @OneToOne(() => NoteEntity, {
    nullable: true,
  })
  @JoinColumn({ name: 'note_id' })
  public note: NoteEntity | null;

  @Column({
    nullable: true,
  })
  @RelationId((opportunity: OpportunityEntity) => opportunity.note)
  public noteId: string | null;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;

  @Column({ nullable: true })
  public roundSize: string | null;

  @Column({ nullable: true })
  public valuation: string | null;

  @Column({ nullable: true })
  public proposedInvestment: string | null;

  @Column({ nullable: true })
  public positioning: string | null;

  @Column({ nullable: true })
  public timing: string | null;

  @Column({ nullable: true })
  public underNda: string | null;

  @Column({ nullable: true, type: 'date' })
  public ndaTerminationDate: Date | null;

  @OneToMany(() => ShareOpportunityEntity, (share) => share.resource)
  public shares: ShareOpportunityEntity[];

  @Column({ nullable: true })
  public sharepointDirectoryId: string | null;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
    this.organisationId = this.organisationId.toLowerCase();
    this.pipelineDefinitionId = this.pipelineDefinitionId.toLowerCase();
    this.pipelineStageId = this.pipelineStageId.toLowerCase();
    this.noteId = this.noteId?.toLowerCase() || null;
  }
}
