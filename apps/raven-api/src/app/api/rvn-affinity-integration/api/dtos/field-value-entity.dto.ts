import { FieldValueRankedDropdownDto } from './field-value-ranked-dropdown.dto';
import { PersonDto } from './person.dto';

export type FieldValueEntityDto =
  | FieldValueRankedDropdownDto
  | PersonDto
  | string
  | number;
