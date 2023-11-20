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
  UpdateDateColumn,
} from 'typeorm';

import { AuditableEntity } from '../../../shared/interfaces/auditable.interface';
import { UserEntity } from '../../rvn-users/entities/user.entity';
import { FieldGroupEntity } from './field-group.entity';

@Entity({ name: 'field_definitions' })
@Index(['id', 'group'], { unique: true })
export class FieldDefinitionEntity implements AuditableEntity {
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

  @Index()
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'created_by_id' })
  public createdBy: UserEntity;

  @Column()
  @RelationId((fd: FieldDefinitionEntity) => fd.createdBy)
  public createdById: string;

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
    this.createdById = this.createdById?.toLowerCase();
  }
}
