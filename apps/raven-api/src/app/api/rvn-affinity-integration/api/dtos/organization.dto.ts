import { EntityType } from './list-type.dto';

export class OrganizationDto {
  public id: number;
  public type: EntityType.Organization;
  public name: string;
  public domain: string;
  public domains: string[];
  public global: boolean;
}

export class OrganisationWithCrunchbaseDto {
  public id: number;
  public name: string;
  public domain: string;
  public domains: string[];
  public global: boolean;
  public crunchbase_uuid: string;
}
