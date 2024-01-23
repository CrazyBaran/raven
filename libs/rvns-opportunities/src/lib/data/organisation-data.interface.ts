import { CompanyDto } from '@app/shared/data-warehouse';
import { PagedData } from 'rvns-shared';
import { OpportunityDataWithoutOrganisation } from './opportunity-data.interface';

export interface PagedOrganisationData
  extends PagedData<OrganisationDataWithOpportunities> {}

export interface OrganisationData {
  readonly id?: string;
  readonly affinityInternalId?: number;
  readonly name: string;
  readonly domains: string[];
  readonly affinityUrl?: string;
  sharepointDirectory?: string;
  sharePointPath?: string;
  data?: CompanyDto;
}

export interface OrganisationDataWithOpportunities extends OrganisationData {
  readonly opportunities: OpportunityDataWithoutOrganisation[];
}
