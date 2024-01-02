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
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

import { BaseAuditableEntity } from '../../../shared/interfaces/auditable.interface';
import { PipelineStageEntity } from '../../rvn-pipeline/entities/pipeline-stage.entity';
import { FieldGroupEntity } from './field-group.entity';

@Entity({ name: 'field_definitions' })
@Index(['id', 'group'], { unique: true })
export class FieldDefinitionEntity implements BaseAuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 50 })
  public name: string;

  @Column({ length: 50 })
  public type: string;

  @Column()
  public order: number;

  @ManyToOne(() => FieldGroupEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  public group: FieldGroupEntity;

  @Column({ nullable: false })
  @RelationId((fd: FieldDefinitionEntity) => fd.group)
  public groupId: string;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  public configuration: string;

  @ManyToMany(() => PipelineStageEntity, {
    eager: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'field_hide_pipeline_stage',
    joinColumn: { name: 'field_id' },
    inverseJoinColumn: { name: 'pipeline_stage_id' },
  })
  public hideOnPipelineStages: PipelineStageEntity[];

  @CreateDateColumn()
  public createdAt: Date;

  @Index()
  @UpdateDateColumn()
  public updatedAt: Date;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
    this.groupId = this.groupId?.toLowerCase();
  }
}
