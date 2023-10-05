import { FieldValueRankedDropdownDto } from '../api/dtos/field-value-ranked-dropdown.dto';
import { OrganizationDto } from '../api/dtos/organization.dto';

export class OrganizationStageDto {
  public organizationDto: OrganizationDto;
  public stage?: FieldValueRankedDropdownDto;
}
