import {
  AfterInsert,
  AfterLoad,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { OrganisationEntity } from './organisation.entity';

@Entity('organisation_domains')
@Index(['organisationId', 'domain'], { unique: true })
export class OrganisationDomainEntity {
  @PrimaryColumn()
  @RelationId(
    (organisationDomain: OrganisationDomainEntity) =>
      organisationDomain.organisation,
  )
  public organisationId: string;

  @PrimaryColumn()
  public domain: string;

  @ManyToOne(() => OrganisationEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organisation_id' })
  public organisation: OrganisationEntity;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.organisationId = this.organisationId.toLowerCase();
  }
}
