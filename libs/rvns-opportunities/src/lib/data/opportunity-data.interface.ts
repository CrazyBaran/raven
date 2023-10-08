import { PipelineStageData } from '@app/rvns-pipelines';
import { OrganisationData } from './organisation-data.interface';

export interface OpportunityData extends OpportunityDataWithoutOrganisation {
  readonly organisation: OrganisationData;
}

export interface OpportunityDataWithoutOrganisation {
  readonly id: string;
  readonly stage: PipelineStageData;
}
