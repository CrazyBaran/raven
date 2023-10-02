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

@Entity({ name: 'field_contents' })
@Index(['id', 'createdBy'], { unique: true })
export class FieldContentEntity implements AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public value: string;

  @Index()
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  public createdBy: UserEntity;

  @Column()
  @RelationId((t: FieldContentEntity) => t.createdBy)
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
    this.createdById = this.createdById.toLowerCase();
  }
}
