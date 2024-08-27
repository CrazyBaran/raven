import { ShortlistData } from '@app/rvns-shortlists';
import { CompanyDto } from '@app/shared/data-warehouse';
import { CompanyStatus, PagedData } from 'rvns-shared';
import { OpportunityDataWithoutOrganisation } from './opportunity-data.interface';
export interface PagedOrganisationData
  extends PagedData<OrganisationDataWithOpportunities> {}

export interface OrganisationData {
  readonly id?: string;
  readonly affinityInternalId?: number;
  readonly name: string;
  readonly customDescription?: string;
  readonly customDescriptionUpdatedAt?: Date;
  readonly domains: string[];
  readonly affinityUrl?: string;
  companyStatus?: CompanyStatus | null;
  sharepointDirectory?: string;
  sharePointPath?: string;
  data?: Partial<CompanyDto>;
  shortlists?: Partial<ShortlistData>[];
  fundManagerId?: string;
}

export interface OrganisationDataWithOpportunities extends OrganisationData {
  readonly opportunities: OpportunityDataWithoutOrganisation[];
}
