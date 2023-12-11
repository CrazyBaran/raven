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
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

import { BaseAuditableEntity } from '../../../shared/interfaces/auditable.interface';
import { FieldConfigurationEntity } from './field-configuration.entity';
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

  @OneToMany(
    () => FieldConfigurationEntity,
    (fc: FieldConfigurationEntity) => fc.fieldDefinition,
    { cascade: ['insert'] },
  )
  public configurations: FieldConfigurationEntity[];

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

    this.configuration = this.configurations.reduce(
      (acc, curr) => ({ ...acc, [curr.key]: curr.value }),
      {},
    );
  }
  /* eslint-disable @typescript-eslint/member-ordering */
  public configuration: Record<string, string>;
}
