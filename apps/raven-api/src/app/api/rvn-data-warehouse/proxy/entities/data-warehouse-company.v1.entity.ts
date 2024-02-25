import {
  AfterInsert,
  AfterLoad,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { OrganisationEntity } from '../../../rvn-opportunities/entities/organisation.entity';
import { DataWarehouseCompaniesIndustryV1Entity } from './data-warehouse-company-industries.v1.entity';
import { DataWarehouseCompaniesInvestorV1Entity } from './data-warehouse-company-investors.v1.entity';

@Entity('dwh_v1_companies')
@Index(['organisationId'], { unique: true })
export class DataWarehouseCompanyV1Entity {
  @PrimaryColumn()
  @RelationId(
    (dataWarehouseCompany: DataWarehouseCompanyV1Entity) =>
      dataWarehouseCompany.organisation,
  )
  public organisationId: string;

  @OneToOne(() => OrganisationEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organisation_id' })
  public organisation: OrganisationEntity;

  @Column({ nullable: true, type: 'varchar', length: 250 })
  public name?: string;

  @Column({ nullable: true, type: 'bigint' })
  public fundingTotalFundingAmount?: number;
  @Column({ nullable: true, type: 'bigint' })
  public fundingLastFundingAmount?: number;
  @Column({ nullable: true, type: 'date' })
  public fundingLastFundingDate?: Date;
  @Column({ nullable: true, type: 'varchar', length: '50' })
  public fundingLastFundingRound?: string;

  @Column({ nullable: true, type: 'varchar', length: 'MAX' })
  public hqCountry?: string;
  @Column({ nullable: true, type: 'float' })
  public mcvLeadScore?: number;

  @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
  public data?: string;

  @Column({ nullable: true, type: 'datetime' })
  public lastRefreshedUtc?: Date;

  @Column({ nullable: true, type: 'datetime' })
  public dealRoomLastUpdated?: Date;

  @Column({ nullable: true, type: 'date' })
  public specterLastUpdated?: Date;

  @ManyToMany(() => DataWarehouseCompaniesInvestorV1Entity, {
    eager: true,
    cascade: true,
  })
  @JoinTable({
    name: 'dwh_v1_companies_investors_companies',
    joinColumn: { name: 'organisation_id' },
    inverseJoinColumn: { name: 'investor_id' },
  })
  public investors: DataWarehouseCompaniesInvestorV1Entity[];

  @ManyToMany(() => DataWarehouseCompaniesIndustryV1Entity, {
    eager: true,
    cascade: true,
  })
  @JoinTable({
    name: 'dwh_v1_companies_industries_companies',
    joinColumn: { name: 'organisation_id' },
    inverseJoinColumn: { name: 'industry_id' },
  })
  public industries: DataWarehouseCompaniesIndustryV1Entity[];

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.organisationId = this.organisationId.toLowerCase();
  }
}
