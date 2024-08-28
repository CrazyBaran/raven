import { FundManagerRelationStrength } from 'rvns-shared';

export class UpdateManagerDto {
  public readonly name?: string;
  public readonly description?: string;
  public readonly strategy?: string;
  public readonly geography?: string;
  public readonly avgCheckSize?: string;
  public readonly industryTags?: string[];
  public readonly relationshipStrength?: FundManagerRelationStrength | null;
  public readonly keyRelationships?: string[];
}
