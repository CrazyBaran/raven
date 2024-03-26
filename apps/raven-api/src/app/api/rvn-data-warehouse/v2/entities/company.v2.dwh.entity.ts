import { Column, Entity, PrimaryColumn } from 'typeorm';
import { DWH_V2_SCHEMA } from '../data-warehouse.v2.const';

@Entity({
  name: DWH_V2_SCHEMA.views.companies.name,
  schema: DWH_V2_SCHEMA.schemaName,
})
export class CompanyV2DwhEntity {
  @Column({ name: 'Name', type: 'nvarchar', length: 'MAX' })
  public name: string;

  @Column({ name: 'Domain', type: 'varchar', length: 300 })
  public domain: string;

  @Column({ name: 'Description', type: 'nvarchar', length: 'MAX' })
  public description: string;

  @Column({ name: 'Description Data Source', type: 'varchar', length: 50 })
  public descriptionDataSource: string;

  @Column({ name: 'Country', type: 'nvarchar', length: 4000 })
  public country: string;

  @Column({ name: 'City', type: 'nvarchar', length: 4000 })
  public city: string;

  @Column({ name: 'DealRoom URL', type: 'nvarchar', length: '4000' })
  public dealRoomUrl: string;

  @Column({ name: 'PitchBook URL', type: 'nvarchar', length: '4000' })
  public pitchBookUrl: string;

  @Column({ name: 'Industries', type: 'varchar', length: 'MAX' })
  public industries: string;

  @Column({ name: 'Investors', type: 'nvarchar', length: 'MAX' })
  public investors: string;

  @Column({ name: 'Specter Industry', type: 'nvarchar', length: 'MAX' })
  public specterIndustry: string;

  @Column({ name: 'Specter Sub-Industry', type: 'nvarchar', length: 'MAX' })
  public specterSubIndustry: string;

  @Column({ name: 'Total Funding Amount (USD)', type: 'bigint' })
  public totalFundingAmount: number;

  @Column({ name: 'Last Funding Amount (USD)', type: 'bigint' })
  public lastFundingAmount: number;

  @Column({ name: 'Last Funding Date', type: 'date' })
  public lastFundingDate: Date;

  @Column({ name: 'Last Funding Round', type: 'varchar', length: 50 })
  public lastFundingRound: string;

  @Column({
    name: 'Specter Last Funding Type',
    type: 'nvarchar',
    length: 'MAX',
  })
  public specterLastFundingType: string;

  @Column({ name: 'Specter Investors', type: 'nvarchar', length: 'MAX' })
  public specterInvestors: string;

  @Column({ name: 'MCV Lead Score', type: 'float' })
  public mcvLeadScore: number;

  @Column({ name: 'Specter Last Updated' })
  public specterLastUpdated: Date;

  @Column({ name: 'DealRoom Last Updated' })
  public dealRoomLastUpdated: Date;

  @Column({ name: 'LastRefreshedUTC', type: 'datetime' })
  public lastRefreshedUtc: Date;

  @PrimaryColumn({ name: 'DealRoomCompanyID', type: 'bigint' })
  public dealRoomCompanyId: number;
}

export const DWH_V2_COMPANY_SELECT_COLUMNS: Partial<
  keyof CompanyV2DwhEntity
>[] = [
  'name',
  'domain',
  'description',
  'descriptionDataSource',
  'country',
  'dealRoomUrl',
  'pitchBookUrl',
  'industries',
  'investors',
  'totalFundingAmount',
  'lastFundingAmount',
  'lastFundingDate',
  'lastFundingRound',
  'mcvLeadScore',
  'specterLastUpdated',
  'dealRoomLastUpdated',
  'lastRefreshedUtc',
];
