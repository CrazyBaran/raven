import { FieldValueRankedDropdownDto } from '../api/dtos/field-value-ranked-dropdown.dto';
import { OrganizationDto } from '../api/dtos/organization.dto';

export class OrganizationStageDto {
  public entryId: number;
  public entryAdded: Date;
  public organizationDto: OrganizationDto;
  public stage?: FieldValueRankedDropdownDto;
  public fields: { displayName: string; value: string }[];
}
