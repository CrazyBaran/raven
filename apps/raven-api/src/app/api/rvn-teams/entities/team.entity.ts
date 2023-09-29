import {
  AfterInsert,
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ShareResource } from '../../rvn-acl/contracts/share-resource.interface';
import { ShareTeamEntity } from '../../rvn-acl/entities/share-team.entity';

@Entity({ name: 'teams' })
export class TeamEntity implements ShareResource {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public name: string;

  @OneToMany(() => ShareTeamEntity, (share) => share.resource)
  public shares: ShareTeamEntity[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  public members: ShareTeamEntity[];

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
    this.members = this.shares;
  }
}
