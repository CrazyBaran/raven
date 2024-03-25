import { AffinityEntityType } from './list-type.affinity.dto';

export class AffinityPersonDto {
  public id: number;
  public type: AffinityEntityType.Person;
  public first_name: string;
  public last_name: string;
  public primary_email: string;
  public emails: string[];
}

export class AffinityPersonWithOrganisationsDto extends AffinityPersonDto {
  public organisation_ids: number[];
}
