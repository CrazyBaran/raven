import { EntityType } from './list-type.dto';

export class PersonDto {
  public id: number;
  public type: EntityType.Person;
  public first_name: string;
  public last_name: string;
  public primary_email: string;
  public emails: string[];
}

export class PersonWithOrganisationsDto extends PersonDto {
  public organisation_ids: number[];
}
