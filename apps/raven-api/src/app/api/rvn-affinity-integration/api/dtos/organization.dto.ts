import { EntityType } from './list-type.dto';

export class OrganizationBaseDto {
  public id: number;
  public name: string;
  public domain: string;
  public domains: string[];
  public global: boolean;
}

export class OrganizationDto extends OrganizationBaseDto {
  public type: EntityType.Organization;
}

export class OrganizationWithCrunchbaseDto extends OrganizationBaseDto {
  public crunchbase_uuid: string;
}
