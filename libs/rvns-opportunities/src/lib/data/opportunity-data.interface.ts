import { OrganisationData } from './organisation-data.interface';
import { PipelineStageData } from './pipeline-stage-data.interface';

export interface OpportunityData extends OpportunityDataWithoutOrganisation {
  readonly organisation: OrganisationData;
}

export interface OpportunityDataWithoutOrganisation {
  readonly id: string;
  readonly stage: PipelineStageData;
}
