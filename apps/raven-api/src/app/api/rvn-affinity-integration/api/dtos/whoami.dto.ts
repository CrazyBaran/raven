import { GrantDto } from './grant.dto';
import { PersonDto } from './person.dto';
import { TenantDto } from './tenant.dto';

export class WhoAmIDto {
  public tenant: TenantDto;
  public user: PersonDto;
  public grant: GrantDto;
}
