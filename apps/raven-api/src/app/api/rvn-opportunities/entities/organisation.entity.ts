import { CompanyStatus } from 'rvns-shared';
import {
  AfterInsert,
  AfterLoad,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { SharepointEnabledEntity } from '../../../shared/interfaces/sharepoint-enabled-entity.interface';
import { DataWarehouseCompanyV1Entity } from '../../rvn-data-warehouse/proxy/entities/data-warehouse-company.v1.entity';
import { FundManagerEntity } from '../../rvn-fund-managers/entities/fund-manager.entity';
import { ShortlistEntity } from '../../rvn-shortlists/entities/shortlist.entity';
import { PrimaryDataSource } from '../interfaces/get-organisations.options';
import { OpportunityEntity } from './opportunity.entity';
import { OrganisationDomainEntity } from './organisation-domain.entity';

@Entity('organisations')
@Index(['id'], { unique: true })
export class OrganisationEntity implements SharepointEnabledEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column({ type: 'nvarchar', length: '1000', nullable: true })
  public customDescription: string;

  @Column({ type: 'datetime', nullable: true })
  public customDescriptionUpdatedAt: Date;

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

  @OneToOne(
    (type) => DataWarehouseCompanyV1Entity,
    (dataWarehouseCompany) => dataWarehouseCompany.organisation,
  )
  public dataV1: DataWarehouseCompanyV1Entity;

  @Column({
    nullable: true,
    default: null,
    enum: CompanyStatus,
    type: 'nvarchar',
    length: '30',
  })
  public companyStatusOverride: CompanyStatus | null;

  @ManyToMany(() => ShortlistEntity, (shortlist) => shortlist.organisations, {
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public shortlists?: ShortlistEntity[];

  @Column({ nullable: true, type: 'varchar' })
  public initialDataSource?: PrimaryDataSource;

  @OneToOne(() => FundManagerEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'fund_manager_id' })
  public fundManager: FundManagerEntity | null;

  @Column({
    nullable: true,
  })
  @RelationId((organisation: OrganisationEntity) => organisation.fundManager)
  public fundManagerId: string | null;

  @ManyToMany(() => FundManagerEntity, (manager) => manager.organisations, {
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public fundManagers?: FundManagerEntity[];

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
