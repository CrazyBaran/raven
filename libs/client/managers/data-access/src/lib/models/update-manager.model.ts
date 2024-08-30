import { Currency, FundManagerRelationStrength } from 'rvns-shared';

export class UpdateManagerDto {
  public readonly name?: string;
  public readonly description?: string;
  public readonly strategy?: string;
  public readonly geography?: string;
  public readonly avgCheckSize?: number;
  public readonly avgCheckSizeCurrency?: Currency;
  public readonly aum?: number;
  public readonly aumCurrency?: Currency;
  public readonly industryTags?: string[];
  public readonly relationshipStrength?: FundManagerRelationStrength | null;
  public readonly keyRelationships?: string[];
}
