import { AffinityEntityType } from './list-type.affinity.dto';

export class AffinityOrganizationBaseDto {
  public id: number;
  public name: string;
  public domain: string;
  public domains: string[];
  public global: boolean;
}

export class AffinityOrganizationDto extends AffinityOrganizationBaseDto {
  public type: AffinityEntityType.Organization;
}

export class AffinityOrganizationWithCrunchbaseDto extends AffinityOrganizationBaseDto {
  public crunchbase_uuid: string;
}
