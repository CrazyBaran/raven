import { PipelineStageData } from '@app/rvns-pipelines';
import { FieldData } from './field-data.interface';
import { OrganisationData } from './organisation-data.interface';

export interface OpportunityData extends OpportunityDataWithoutOrganisation {
  readonly organisation: OrganisationData;
}

interface TagData {
  readonly id: string;
  readonly name: string;
}

export interface OpportunityDataWithoutOrganisation {
  readonly id: string;
  readonly stage: PipelineStageData;
  readonly fields: FieldData[];
  readonly tag?: TagData;
  readonly createdAt?: Date;
  readonly roundSize?: string;
  readonly valuation?: string;
  readonly proposedInvestment?: string;
  readonly positioning?: string;
  readonly timing?: string;
  readonly underNda?: string;
  readonly ndaTerminationDate?: Date;
}
