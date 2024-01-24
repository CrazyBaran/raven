import { Column, Entity, PrimaryColumn } from 'typeorm';
import { DWH_V1_SCHEMA } from '../data-warehouse.v1.const';

@Entity({
  name: DWH_V1_SCHEMA.views.investors.name,
  schema: DWH_V1_SCHEMA.schemaName,
})
export class InvestorDwhEntity {
  @PrimaryColumn({ name: 'DealRoomInvestorID' })
  public investorId: number;

  @Column({ name: 'Name' })
  public name: string;

  @Column({ name: 'Website' })
  public website: string;

  @Column({ name: 'Launch Month' })
  public launchMonth: number;

  @Column({ name: 'Launch Year' })
  public launchYear: number;

  @Column({ name: 'DealRoom Investor Type' })
  public investorType: string;

  @Column({ name: 'Deal Size' })
  public dealSize: string;

  @Column({ name: 'Total Funding (Millions)' })
  public totalFundingMillions: number;

  @Column({ name: 'Total Funding' })
  public totalFunding: number;

  @Column({ name: 'Number of Investments' })
  public numberOfInvestments: number;

  @Column({ name: 'Tagline' })
  public tagline: string;

  @Column({ name: 'Description' })
  public description: string;

  @Column({ name: 'Angellist URL' })
  public angellistUrl: string;

  @Column({ name: 'Crunchbase URL' })
  public crunchbaseUrl: string;

  @Column({ name: 'Facebook URL' })
  public facebookUrl: string;

  @Column({ name: 'Google URL' })
  public googleUrl: string;

  @Column({ name: 'Linkedin URL' })
  public linkedinUrl: string;

  @Column({ name: 'Twitter URL' })
  public twitterUrl: string;

  @Column({ name: 'Dealroom URL' })
  public dealroomUrl: string;

  @Column({ name: 'DealRoom Country Experience' })
  public dealroomCountryExperience: string;

  @Column({ name: 'DealRoom Deal Structure' })
  public dealroomDealStructure: string;

  @Column({ name: 'DealRoom Last Updated (UTC)' })
  public dealroomLastUpdated: Date;
}
