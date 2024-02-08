import { CompanyStatus } from 'rvns-shared';
import {
  AfterInsert,
  AfterLoad,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  ValueTransformer,
} from 'typeorm';
import { SharepointEnabledEntity } from '../../../shared/interfaces/sharepoint-enabled-entity.interface';
import { OpportunityEntity } from './opportunity.entity';
import { OrganisationDomainEntity } from './organisation-domain.entity';

export class SimpleArrayTransformer implements ValueTransformer {
  public to(value: string[] | string): string {
    if ((value as string[])?.join) {
      return (value as string[])?.join(',');
    }
    return value as string;
  }

  public from(value: string): string[] {
    return value?.split(',');
  }
}

@Entity('organisations')
@Index(['id'], { unique: true })
export class OrganisationEntity implements SharepointEnabledEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @OneToMany(
    (type) => OpportunityEntity,
    (opportunity) => opportunity.organisation,
  )
  public opportunities: OpportunityEntity[];

  @Column({ nullable: true })
  public sharepointDirectoryId: string | null;

  @OneToMany(
    (type) => OrganisationDomainEntity,
    (organisationDomain) => organisationDomain.organisation,
  )
  public organisationDomains: OrganisationDomainEntity[];

  @Column({
    nullable: true,
    default: null,
    enum: CompanyStatus,
    type: 'nvarchar',
    length: '30',
  })
  public companyStatusOverride: CompanyStatus | null;

  public domains: string[];
  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
    this.domains = this.organisationDomains?.map((organisationDomain) =>
      organisationDomain.domain.toLowerCase(),
    );
  }
}
