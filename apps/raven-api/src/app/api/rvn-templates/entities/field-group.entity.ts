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

import { UserEntity } from '../../rvn-users/entities/user.entity';
import { AuditableEntity } from '../../../shared/interfaces/auditable.interface';
import { TemplateEntity } from './template.entity';

@Entity({ name: 'field_groups' })
@Index(['id', 'template'], { unique: true })
export class FieldGroupEntity implements AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 50 })
  public name: string;

  @Column()
  public order: number;

  @ManyToOne(() => TemplateEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'template_id' })
  public template: TemplateEntity;

  @Column()
  @RelationId((t: FieldGroupEntity) => t.template)
  public templateId: string;

  @Index()
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  public createdBy: UserEntity;

  @Column()
  @RelationId((t: FieldGroupEntity) => t.createdBy)
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
    this.templateId = this.templateId.toLowerCase();
    this.createdById = this.createdById.toLowerCase();
  }
}
