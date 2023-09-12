import {
  AfterInsert,
  AfterLoad,
  Column,
  CreateDateColumn,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

import { ShareRole } from '@app/rvns-acl';

import { UserEntity } from '../../rvn-users/entities/user.entity';
import { ShareResource } from '../contracts/share-resource.interface';
import { Share } from '../contracts/share.interface';
import { ShareResourceCode } from '../enums/share-resource-code.enum';

@Index(['actor', 'resource'], { unique: true })
export abstract class AbstractShareEntity implements Share {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar' })
  public role: ShareRole;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'actor_id' })
  public actor: UserEntity;

  @Column()
  @RelationId((s: AbstractShareEntity) => s.actor)
  public actorId: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  public resource: ShareResource;

  public resourceId: string;

  public abstract readonly resourceCode: ShareResourceCode;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
    this.resourceId = this.resourceId
      ? this.resourceId.toLowerCase()
      : this.resourceId;
    this.actorId = this.actorId ? this.actorId.toLowerCase() : this.actorId;
  }
}
