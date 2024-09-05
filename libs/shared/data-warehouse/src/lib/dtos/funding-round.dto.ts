export class FundingRoundDto {
  public domain: string;
  public date: Date;
  public round: string;
  public amount: number;
  public currency: string;
  public amountInUsd: number;
  public investors: FundingRoundInvestor[] | string[];
  public dataSource?: string;
  public preValuationInUsd?: number;
  public postValuationInUsd?: number;
}

export interface FundingRoundInvestor {
  id?: string;
  name: string;
  organisationId?: string;
  organisation?: {
    id: string;
    name: string;
    fundManagerId?: string | null;
  };
}

export const exposedFundingRoundData: Partial<keyof FundingRoundDto>[] = [
  'domain',
  'date',
  'round',
  'amount',
  'currency',
  'amountInUsd',
  'investors',
  'dataSource',
  'preValuationInUsd',
  'postValuationInUsd',
];
