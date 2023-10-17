import { TagTypeEnum } from '@app/rvns-tags';
import {
  ChildEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  TableInheritance,
} from 'typeorm';
import { OrganisationEntity } from '../../rvn-opportunities/entities/organisation.entity';
import { UserEntity } from '../../rvn-users/entities/user.entity';

@Entity({ name: 'tags' })
@Index(['id', 'type'])
@TableInheritance({ column: 'type' })
export class TagEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public name: string;

  @Column({ type: 'varchar' })
  public type: TagTypeEnum;
}

@ChildEntity()
export class PeopleTagEntity extends TagEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;

  @Column()
  @RelationId((t: PeopleTagEntity) => t.user)
  public userId: string;
}

@ChildEntity()
export class OrganisationTagEntity extends TagEntity {
  @ManyToOne(() => OrganisationEntity)
  @JoinColumn({ name: 'organisation_id' })
  public organisation: OrganisationEntity;

  @Column()
  @RelationId((t: OrganisationTagEntity) => t.organisation)
  public organisationId: string;
}
