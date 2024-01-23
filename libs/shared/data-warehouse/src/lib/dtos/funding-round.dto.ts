export class FundingRoundDto {
  public fundingRoundId: number;
  public year: number;
  public month: number;
  public round: string;
  public amount: number;
  public currency: string;
  public dealRoomDataSource: string;
  public dealRoomSourceVerified: string;
  public lastRefreshedUTC: Date;
}
