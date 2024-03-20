export type OrganisationFundingData = {
  readonly amount: number;
  readonly amountInUsd: number;
  readonly currency: string;
  readonly date: Date;
  readonly domain: string;
  readonly round: string;
  readonly investors: Array<string>;
};
