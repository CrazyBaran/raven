import { OrganisationData } from './organisation-data.interface';
import { PipelineStageData } from './pipeline-stage-data.interface';

export interface OpportunityData {
  readonly id: string;
  readonly organisation: OrganisationData;
  readonly stage: PipelineStageData;
  readonly createdById: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
}
