import { OrganizationDto } from './api/organization.dto';
import { FieldValueEntityDto } from './api/field-value-entity.dto';

export class OrganizationStageDto {
  public organizationDto: OrganizationDto;
  public stage?: FieldValueEntityDto;
}
