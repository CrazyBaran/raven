import { TagTypeEnum } from '@app/rvns-tags';
import {
  AfterInsert,
  AfterLoad,
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
@Index(['name', 'type'], { unique: true })
@TableInheritance({ column: 'class' })
export class TagEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column({ type: 'varchar' })
  public type: TagTypeEnum;

  @Column({ type: 'varchar' })
  public class: string;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
    if (this.type === TagTypeEnum.People) {
      (this as unknown as PeopleTagEntity).userId = (
        this as unknown as PeopleTagEntity
      ).userId.toLowerCase();
    }
    if (
      this.type === TagTypeEnum.Company ||
      this.type === TagTypeEnum.Investor
    ) {
      (this as unknown as OrganisationTagEntity).organisationId = (
        this as unknown as OrganisationTagEntity
      ).organisationId.toLowerCase();
    }
  }
}

@ChildEntity()
export class PeopleTagEntity extends TagEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;

  @Column()
  @RelationId((t: PeopleTagEntity) => t.user)
  public userId: string;

  @AfterInsert()
  @AfterLoad()
  public override lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
    this.userId = this.userId.toLowerCase();
  }
}

@ChildEntity()
export class OrganisationTagEntity extends TagEntity {
  @ManyToOne(() => OrganisationEntity)
  @JoinColumn({ name: 'organisation_id' })
  public organisation: OrganisationEntity;

  @Column()
  @RelationId((t: OrganisationTagEntity) => t.organisation)
  public organisationId: string;

  @AfterInsert()
  @AfterLoad()
  public override lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
    this.organisationId = this.organisationId.toLowerCase();
  }
}
