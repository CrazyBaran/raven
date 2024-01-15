import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PipelineStageEntity } from './pipeline-stage.entity';

@Entity({ name: 'pipeline_groups' })
export class PipelineGroupEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public groupName: string;

  @ManyToMany(() => PipelineStageEntity, { eager: false })
  @JoinTable({
    name: 'pipeline_stage_groups',
    joinColumn: { name: 'pipeline_stage_group_id' },
    inverseJoinColumn: { name: 'pipeline_stage_id' },
  })
  public stages: PipelineStageEntity[];
}
