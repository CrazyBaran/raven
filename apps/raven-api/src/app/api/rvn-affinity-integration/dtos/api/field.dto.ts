import { DropdownOptionDto } from './dropdown-option.dto';

export class FieldDto {
  public id: number;
  public name: string;
  public value_type: number;
  public allows_multiple: boolean;
  public dropdown_options: DropdownOptionDto[];
}
