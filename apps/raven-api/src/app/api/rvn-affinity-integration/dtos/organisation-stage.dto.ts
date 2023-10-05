import { OrganizationDto } from '../api/dtos/organization.dto';
import { FieldValueRankedDropdownDto } from '../api/dtos/field-value-ranked-dropdown.dto';

export class OrganizationStageDto {
  public organizationDto: OrganizationDto;
  public stage?: FieldValueRankedDropdownDto;
}
