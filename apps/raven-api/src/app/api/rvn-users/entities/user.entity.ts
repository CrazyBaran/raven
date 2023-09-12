import {
  AfterInsert,
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RoleEntity } from './role.entity';

@Entity({ name: 'users' })
@Index(['id', 'activated', 'suspended', 'sessionInvalidated'], { unique: true })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column({ unique: true })
  public email: string;

  @ManyToMany(() => RoleEntity, { eager: true })
  @JoinTable({
    name: 'users_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  public roles: RoleEntity[];

  @Column({ default: false })
  public activated: boolean;

  @Column({ nullable: true })
  public activationDate: Date | null;

  @Column({ default: false })
  public suspended: boolean;

  @Column({ nullable: true })
  public suspensionDate: Date | null;

  @Column({ default: false })
  public sessionInvalidated: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
  }
}
