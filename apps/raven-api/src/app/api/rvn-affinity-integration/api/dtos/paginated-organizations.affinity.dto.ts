import { AffinityOrganizationWithCrunchbaseDto } from './organization.affinity.dto';

export class PaginatedAffinityOrganizationsDto {
  public organizations: AffinityOrganizationWithCrunchbaseDto[];
  public next_page_token: string;
}
