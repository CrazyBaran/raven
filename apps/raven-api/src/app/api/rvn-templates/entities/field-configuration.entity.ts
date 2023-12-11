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
import { FieldDefinitionEntity } from './field-definition.entity';

@Entity({ name: 'field_configuration' })
@Index(['id'], { unique: true })
export class FieldConfigurationEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 50 })
  public key: string;

  @Column()
  public value: string;

  @ManyToOne(() => FieldDefinitionEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'field_id' })
  public fieldDefinition: FieldDefinitionEntity;

  @Column()
  @RelationId((fc: FieldConfigurationEntity) => fc.fieldDefinition)
  public fieldDefinitionId: string;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
  }
}
