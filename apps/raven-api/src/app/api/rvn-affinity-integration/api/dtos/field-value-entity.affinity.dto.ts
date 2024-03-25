import { AffinityFieldValueRankedDropdownDto } from './field-value-ranked-dropdown.affinity.dto';
import { AffinityPersonDto } from './person.affinity.dto';

export type AffinityFieldValueEntityDto =
  | AffinityFieldValueRankedDropdownDto
  | AffinityPersonDto
  | string
  | number;
