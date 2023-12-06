import { FileData } from '@app/rvns-files';
import { PipelineStageData } from '@app/rvns-pipelines';
import { PagedData } from 'rvns-shared';
import { FieldData } from './field-data.interface';
import { OpportunityTeamData } from './opportunity-team-data.interface';
import { OrganisationData } from './organisation-data.interface';

export interface PagedOpportunityData extends PagedData<OpportunityData> {}

export interface OpportunityData extends OpportunityDataWithoutOrganisation {
  readonly organisation: OrganisationData;
}

interface TagData {
  readonly id: string;
  readonly name: string;
}

export interface OpportunityDataWithoutOrganisation {
  readonly id: string;
  stage: PipelineStageData;
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
  readonly files?: FileData[];
  readonly sharePointDirectory?: string;
  readonly sharepointDirectoryId?: string;
  team?: OpportunityTeamData;
}
