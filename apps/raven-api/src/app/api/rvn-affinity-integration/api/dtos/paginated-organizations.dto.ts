import { OrganizationWithCrunchbaseDto } from './organization.dto';

export class PaginatedOrganizationsDto {
  public organizations: OrganizationWithCrunchbaseDto[];
  public next_page_token: string;
}
