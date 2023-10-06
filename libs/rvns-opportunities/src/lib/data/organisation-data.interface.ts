import { OpportunityDataWithoutOrganisation } from './opportunity-data.interface';

export interface OrganisationData {
  readonly id?: string;
  readonly affinityInternalId?: number;
  readonly name: string;
  readonly domains: string[];
}

export interface OrganisationDataWithOpportunities extends OrganisationData {
  readonly opportunities: OpportunityDataWithoutOrganisation[];
}
