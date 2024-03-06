import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PipelineUtilityService } from '../../rvn-pipeline/pipeline-utility.service';
import { OrganisationPassedEvent } from '../events/organisation-passed.event';
import { OpportunityChecker } from '../opportunity.checker';
import { OpportunityService } from '../opportunity.service';

@Injectable()
export class OrganisationPassedEventHandler {
  public constructor(
    private readonly opportunityService: OpportunityService,
    private readonly opportunityChecker: OpportunityChecker,
    private readonly pipelineUtilityService: PipelineUtilityService,
  ) {}

  @OnEvent('organisation-passed')
  protected async createOpportunity(
    event: OrganisationPassedEvent,
  ): Promise<void> {
    if (
      !(await this.opportunityChecker.hasActivePipelineItem(
        event.organisationEntity,
      ))
    ) {
      return;
    }

    const activeOpportunity =
      await this.opportunityChecker.getActiveOrNewestOpportunity(
        event.organisationEntity,
      );
    if (activeOpportunity) {
      const passedStage =
        await this.pipelineUtilityService.getPassedOpportunityStage();
      await this.opportunityService.update(
        activeOpportunity,
        {
          pipelineStage: passedStage,
        },
        event.user,
      );
    }
  }
}
