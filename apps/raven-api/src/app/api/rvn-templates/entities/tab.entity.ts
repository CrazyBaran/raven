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

import { AuditableEntity } from '../../../shared/interfaces/auditable.interface';
import { UserEntity } from '../../rvn-users/entities/user.entity';
import { FieldGroupEntity } from './field-group.entity';
import { TemplateEntity } from './template.entity';

@Entity({ name: 'tabs' })
@Index(['id', 'template'], { unique: true })
export class TabEntity implements AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 50 })
  public name: string;

  @Column()
  public order: number;

  @OneToMany(() => FieldGroupEntity, (fg) => fg.tab, { eager: true })
  public fieldGroups: FieldGroupEntity[];

  @ManyToOne(() => TemplateEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'template_id' })
  public template: TemplateEntity;

  @Column()
  @RelationId((t: TabEntity) => t.template)
  public templateId: string;

  @Index()
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'created_by_id' })
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
