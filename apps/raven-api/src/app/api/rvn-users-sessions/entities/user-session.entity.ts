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
} from 'typeorm';

import { UserEntity } from '../../rvn-users/entities/user.entity';

@Entity({ name: 'users_sessions' })
@Index(['user', 'ip', 'agent', 'invalidated', 'expiresAt'])
export class UserSessionEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;

  @Column()
  @RelationId((s: UserSessionEntity) => s.user)
  public userId: string;

  @Column()
  public ip: string;

  @Column()
  public agent: string;

  @Column({ length: 4000 })
  public refresh: string;

  @Column({ default: false })
  public invalidated: boolean;

  @Column()
  public lastUseIp: string;

  @Column()
  public lastUseAgent: string;

  @Column()
  public lastUseDate: Date;

  @Column()
  public expiresAt: Date;

  @CreateDateColumn()
  public createdAt: Date;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
    this.userId = this.userId.toLowerCase();
  }
}
