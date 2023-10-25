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

@Entity({ name: 'storage_account_files' })
export class StorageAccountFileEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'nvarchar', length: '256', nullable: false })
  public originalFileName: string;

  @Column({ type: 'uuid', nullable: true })
  public noteRootVersionId: string;

  @Index()
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'created_by_id' })
  public createdBy: UserEntity;

  @Column()
  @RelationId((t: StorageAccountFileEntity) => t.createdBy)
  public createdById: string;

  @CreateDateColumn()
  public createdAt: Date;

  @Index()
  @UpdateDateColumn({ nullable: true })
  public updatedAt: Date;

  @Index()
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'updated_by_id' })
  public updatedBy: UserEntity;

  @Column({ nullable: true })
  @RelationId((t: StorageAccountFileEntity) => t.updatedBy)
  public updatedById: string;

  public get fileName(): string {
    return `${this.id}--${this.originalFileName}`;
  }

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
    this.createdById = this.createdById.toLowerCase();
    if (this.updatedById) this.updatedById = this.updatedById.toLowerCase();
  }
}
