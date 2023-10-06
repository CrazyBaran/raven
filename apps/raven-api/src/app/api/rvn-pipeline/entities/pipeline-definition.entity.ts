import {
  AfterInsert,
  AfterLoad,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'pipeline_definitions' })
@Index(['id'], { unique: true })
export class PipelineDefinitionEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
  }
}
