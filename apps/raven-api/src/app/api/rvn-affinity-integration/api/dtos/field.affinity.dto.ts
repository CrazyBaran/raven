import { AffinityDropdownOptionDto } from './dropdown-option.affinity.dto';

export class AffinityFieldDto {
  public id: number;
  public name: string;
  public value_type: number;
  public allows_multiple: boolean;
  public dropdown_options: AffinityDropdownOptionDto[];
}
