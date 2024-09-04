import { FundManagerContactStrength } from 'rvns-shared';

export class CreateContactDto {
  public readonly name: string;
  public readonly position: string;
  public readonly relationStrength: FundManagerContactStrength | null;
  public readonly email: string;
  public readonly linkedin: string;
}
