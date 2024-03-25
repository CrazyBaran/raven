import { AffinityFieldValueEntityDto } from '../api/dtos/field-value-entity.affinity.dto';
import { AffinityFieldValueRankedDropdownDto } from '../api/dtos/field-value-ranked-dropdown.affinity.dto';
import { AffinityOrganizationBaseDto } from '../api/dtos/organization.affinity.dto';

export class OrganizationStageDto {
  public entityId: number;
  public listEntryId: number;
  public entryAdded: Date;
  public organizationDto: AffinityOrganizationBaseDto;
  public stage?: AffinityFieldValueRankedDropdownDto;
  public fields: {
    displayName: string;
    value: AffinityFieldValueEntityDto | AffinityFieldValueEntityDto[];
  }[];
}
