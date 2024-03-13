import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PipelineUtilityService } from '../rvn-pipeline/pipeline-utility.service';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { OrganisationEntity } from './entities/organisation.entity';
import { OpportunityChecker } from './opportunity.checker';
import { OpportunityService } from './opportunity.service';

@Injectable()
export class OrganisationHelperService {
  public constructor(
    @Inject(forwardRef(() => OpportunityService))
    private readonly opportunityService: OpportunityService,
    private readonly opportunityChecker: OpportunityChecker,
    private readonly pipelineUtilityService: PipelineUtilityService,
  ) {}

  public async handleCompanyPassed(
    organisationEntity: OrganisationEntity,
    user: UserEntity,
  ): Promise<void> {
    if (
      !(await this.opportunityChecker.hasActivePipelineItem(organisationEntity))
    ) {
      return;
    }

    const activeOpportunity =
      await this.opportunityChecker.getActiveOrNewestOpportunity(
        organisationEntity,
      );
    if (activeOpportunity) {
      const passedStage =
        await this.pipelineUtilityService.getPassedOpportunityStage();
      await this.opportunityService.update(
        activeOpportunity,
        {
          pipelineStage: passedStage,
        },
        user,
      );
    }
  }
}
