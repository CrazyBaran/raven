import {
  AfterInsert,
  AfterLoad,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PipelineStageEntity } from './pipeline-stage.entity';

@Entity({ name: 'pipeline_definitions' })
@Index(['id', 'name'], { unique: true })
export class PipelineDefinitionEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column({ default: false })
  public isDefault: boolean;

  @OneToMany(() => PipelineStageEntity, (ps) => ps.pipelineDefinition, {
    eager: true,
    cascade: ['insert'],
  })
  public stages: PipelineStageEntity[];

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
  }
}
