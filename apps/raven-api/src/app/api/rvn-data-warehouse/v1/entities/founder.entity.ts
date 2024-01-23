import { Column, Entity, PrimaryColumn } from 'typeorm';
import { DWH_V1_SCHEMA } from '../data-warehouse.v1.const';

@Entity({
  name: DWH_V1_SCHEMA.views.founders.name,
  schema: DWH_V1_SCHEMA.schemaName,
})
export class FounderEntity {
  @PrimaryColumn({ name: 'DealRoomFounderID' })
  public founderId: number;

  @Column({ name: 'Name' })
  public name: string;

  @Column({ name: 'DealRoom Founder Type' })
  public founderType: string;

  @Column({ name: 'Dealroom URL' })
  public dealroomUrl: string;

  @Column({ name: 'Backgrounds' })
  public backgrounds: string;

  @Column({ name: 'Gender' })
  public gender: string;

  @Column({ name: 'IsSerialFounder' })
  public isSerialFounder: string;

  @Column({ name: 'Universities' })
  public universities: string;

  @Column({ name: 'Tagline' })
  public tagline: string;

  @Column({ name: 'Website' })
  public website: string;

  @Column({ name: 'Twitter URL' })
  public twitterUrl: string;

  @Column({ name: 'Facebook URL' })
  public facebookUrl: string;

  @Column({ name: 'Linkedin URL' })
  public linkedinUrl: string;

  @Column({ name: 'Google URL' })
  public googleUrl: string;

  @Column({ name: 'Crunchbase URL' })
  public crunchbaseUrl: string;

  @Column({ name: 'Angellist URL' })
  public angellistUrl: string;

  @Column({ name: 'HQ Locations' })
  public hqLocations: string;

  @Column({ name: 'DealRoom Founder Score' })
  public founderScore: string;

  @Column({ name: 'IsFounder' })
  public isFounder: string;

  @Column({ name: 'IsStrongFounder' })
  public isStrongFounder: string;

  @Column({ name: 'IsSuperFounder' })
  public isSuperFounder: string;

  @Column({ name: 'IsPromisingFounder' })
  public isPromisingFounder: string;

  @Column({ name: 'Total Funding' })
  public totalFunding: number;

  @Column({ name: 'DealRoom LastUpdated (UTC)' })
  public lastUpdated: Date;
}
