import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'DealRoomFundingRounds', schema: 'Raven' })
export class DealroomFundingRoundEntity {
  @PrimaryColumn({ name: 'DealRoomCompanyID' })
  public companyId: number;

  @Column({ name: 'DealRoomFundingRoundID' })
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
