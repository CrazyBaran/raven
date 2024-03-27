export class FundingRoundDto {
  public domain: string;
  public date: Date;
  public round: string;
  public amount: number;
  public currency: string;
  public amountInUsd: number;
  public investors: string[];
  public dataSource?: string;
  public preValuationInUsd?: number;
  public postValuationInUsd?: number;
}

export const exposedFundingRoundData: Partial<keyof FundingRoundDto>[] = [
  'domain',
  'date',
  'round',
  'amount',
  'currency',
  'amountInUsd',
  'investors',
];
