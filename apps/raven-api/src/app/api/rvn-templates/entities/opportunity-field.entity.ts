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

import { OpportunityEntity } from '../../rvn-opportunities/entities/opportunity.entity';
import { FieldDefinitionEntity } from './field-definition.entity';
import { FieldContentEntity } from './field-content.entity';
import { AuditableEntity } from '../../../shared/interfaces/auditable.interface';
import { UserEntity } from '../../rvn-users/entities/user.entity';

@Entity({ name: 'opportunity_fields' })
@Index(['id', 'fieldDefinition', 'fieldContent', 'opportunity'], {
  unique: true,
})
export class OpportunityFieldEntity implements AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => FieldContentEntity)
  @JoinColumn({ name: 'field_content_id' })
  public fieldContent: FieldContentEntity;

  @Column()
  public fieldContentId: string;

  @ManyToOne(() => FieldDefinitionEntity, { nullable: true })
  @JoinColumn({ name: 'field_definition_id' })
  public fieldDefinition: FieldDefinitionEntity | null;

  @Column()
  public fieldDefinitionId: string | null;

  @ManyToOne(() => OpportunityEntity)
  @JoinColumn({ name: 'opportunity_id' })
  public opportunity: OpportunityEntity;

  @Column()
  public opportunityId: string;

  @Index()
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  public createdBy: UserEntity;

  @Column()
  @RelationId((t: OpportunityFieldEntity) => t.createdBy)
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
    this.fieldContentId = this.fieldContentId.toLowerCase();
    this.fieldDefinitionId = this.fieldDefinitionId?.toLowerCase();
    this.opportunityId = this.opportunityId.toLowerCase();
    this.createdById = this.createdById.toLowerCase();
  }
}
