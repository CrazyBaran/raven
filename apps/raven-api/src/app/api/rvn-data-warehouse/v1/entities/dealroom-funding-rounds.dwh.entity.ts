import { Column, Entity, PrimaryColumn } from 'typeorm';
import { DWH_V1_SCHEMA } from '../data-warehouse.v1.const';

@Entity({
  name: DWH_V1_SCHEMA.views.fundingRounds.name,
  schema: DWH_V1_SCHEMA.schemaName,
})
export class DealroomFundingRoundEntity {
  @Column({ name: 'DealRoomCompanyID' })
  public companyId: number;

  @PrimaryColumn({ name: 'DealRoomFundingRoundID' })
  public fundingRoundId: number;

  @Column({ name: 'Year' })
  public year: number;

  @Column({ name: 'Month' })
  public month: number;

  @Column({ name: 'Round' })
  public round: string;

  @Column({ name: 'Amount' })
  public amount: number;

  @Column({ name: 'Currency' })
  public currency: string;

  @Column({ name: 'DealRoom Data Source' })
  public dealRoomDataSource: string;

  @Column({ name: 'DealRoom Source Verified' })
  public dealRoomSourceVerified: string;

  @Column({ name: 'LastRefreshedUTC' })
  public lastRefreshedUTC: Date;
}
