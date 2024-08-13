import { FileData } from '@app/rvns-files';
import { PipelineStageData } from '@app/rvns-pipelines';
import { PagedData } from 'rvns-shared';
import { TagTypeEnum } from '../../../../rvns-tags/src';
import { FieldData } from './field-data.interface';
import { OpportunityTeamData } from './opportunity-team-data.interface';
import { OrganisationData } from './organisation-data.interface';

export interface PagedOpportunityData extends PagedData<OpportunityData> {}

export interface OpportunityData extends OpportunityDataWithoutOrganisation {
  readonly organisation: OrganisationData;
}

export interface OpportunityDataWithoutOrganisation {
  readonly id: string;
  readonly name?: string | null;
  stage: PipelineStageData;
  readonly fields: FieldData[];
  readonly tag?: {
    readonly id: string;
    readonly name: string;
    readonly type?: TagTypeEnum;
  };
  readonly createdAt?: Date;
  readonly roundSize?: string;
  readonly valuation?: string;
  readonly proposedInvestment?: string;
  readonly positioning?: string;
  readonly timing?: string;
  readonly underNda?: string;
  readonly description?: string;
  readonly coInvestors?: string;
  readonly capitalRaiseHistory?: string;
  readonly ndaTerminationDate?: Date;
  readonly files?: FileData[];
  readonly sharePointDirectory?: string;
  readonly sharepointDirectoryId?: string;
  readonly sharePointPath?: string;
  team?: OpportunityTeamData;
  readonly updatedAt?: Date;
  readonly previousPipelineStageId?: string;
  readonly pipelineStageId?: string;
}
