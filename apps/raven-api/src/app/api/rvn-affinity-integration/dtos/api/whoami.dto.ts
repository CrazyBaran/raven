import { TenantDto } from './tenant.dto';
import { PersonDto } from './person.dto';
import { GrantDto } from './grant.dto';

export class WhoAmIDto {
  public tenant: TenantDto;
  public user: PersonDto;
  public grant: GrantDto;
}
