import { OpportunityDataWithoutOrganisation } from './opportunity-data.interface';

export interface PagedOrganisationData {
  readonly items: OrganisationDataWithOpportunities[];
  readonly total: number;
}

export interface OrganisationData {
  readonly id?: string;
  readonly affinityInternalId?: number;
  readonly name: string;
  readonly domains: string[];
  readonly affinityUrl?: string;
  sharepointDirectory?: string;
}

export interface OrganisationDataWithOpportunities extends OrganisationData {
  readonly opportunities: OpportunityDataWithoutOrganisation[];
}
