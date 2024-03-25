import { AffinityGrantDto } from './grant.affinity.dto';
import { AffinityPersonDto } from './person.affinity.dto';
import { AffinityTenantDto } from './tenant.affinity.dto';

export class AffinityWhoAmIDto {
  public tenant: AffinityTenantDto;
  public user: AffinityPersonDto;
  public grant: AffinityGrantDto;
}
