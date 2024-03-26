import { PipelineStageEntity } from '../../rvn-pipeline/entities/pipeline-stage.entity';
import { TagEntity } from '../../rvn-tags/entities/tag.entity';
import { UserEntity } from '../../rvn-users/entities/user.entity';
import { OrganisationEntity } from '../entities/organisation.entity';

export interface CreateOpportunityForNonExistingOrganisationOptions
  extends CommonCreateOpportunityOptions {
  domain: string;
  name: string;
}

export interface CreateOpportunityForOrganisationOptions
  extends CommonCreateOpportunityOptions {
  organisation: OrganisationEntity;
}

export interface CommonCreateOpportunityOptions {
  userEntity: UserEntity;
}

export interface UpdateOpportunityOptions extends CommonUpdateOptions {
  pipelineStage?: PipelineStageEntity;
  tagEntity?: TagEntity;
}

export interface CommonUpdateOptions {
  roundSize?: string;
  valuation?: string;
  proposedInvestment?: string;
  positioning?: string;
  timing?: string;
  underNda?: string;
  ndaTerminationDate?: Date;
  description?: string;
}
