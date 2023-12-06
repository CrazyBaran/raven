import { FieldValueEntityDto } from '../api/dtos/field-value-entity.dto';
import { FieldValueRankedDropdownDto } from '../api/dtos/field-value-ranked-dropdown.dto';
import { OrganizationBaseDto } from '../api/dtos/organization.dto';

export class OrganizationStageDto {
  public entryId: number;
  public entryAdded: Date;
  public organizationDto: OrganizationBaseDto;
  public stage?: FieldValueRankedDropdownDto;
  public fields: {
    displayName: string;
    value: FieldValueEntityDto | FieldValueEntityDto[];
  }[];
}
