import { AffinityStatusChangedEvent } from '@app/rvns-affinity-integration';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { PipelineUtilityService } from '../../rvn-pipeline/pipeline-utility.service';
import { GatewayEventService } from '../../rvn-web-sockets/gateway/gateway-event.service';
import { OpportunityEntity } from '../entities/opportunity.entity';
import { OrganisationEntity } from '../entities/organisation.entity';
import { OpportunityChecker } from '../opportunity.checker';

@Injectable()
export class AffinityStatusChangedEventHandler {
  public constructor(
    @InjectRepository(OpportunityEntity)
    private readonly opportunityRepository: Repository<OpportunityEntity>,
    @InjectRepository(OrganisationEntity)
    private readonly organisationRepository: Repository<OrganisationEntity>,
    private readonly logger: RavenLogger,
    private readonly gatewayEventService: GatewayEventService,
    private readonly opportunityChecker: OpportunityChecker,
    private readonly pipelineUtilityService: PipelineUtilityService,
  ) {
    this.logger.setContext(AffinityStatusChangedEventHandler.name);
  }

  @OnEvent('affinity-status-changed')
  protected async process(event: AffinityStatusChangedEvent): Promise<void> {
    const organisation = await this.organisationRepository.findOne({
      where: {
        organisationDomains: { domain: In(event.organisationDomains) },
      },
      relations: [
        'organisationDomains',
        'opportunities',
        'opportunities.pipelineStage',
      ],
    });

    if (!organisation) {
      this.logger.debug(
        `No organisation found for domain ${event.organisationDomains[0]}`,
      );
      return;
    }

    const activeOrNewestOpportunity =
      await this.opportunityChecker.getActiveOrNewestOpportunity(organisation);

    if (!activeOrNewestOpportunity) {
      this.logger.debug(
        `No active or newest opportunity found for organisation ${event.organisationDomains[0]}`,
      );
      return;
    }

    const stage = await this.pipelineUtilityService.mapStageForDefaultPipeline(
      event.targetStatusName,
    );
    if (!stage) {
      throw new Error(
        `Cannot find stage with mappedFrom ${event.targetStatusName}!`,
      );
    }

    activeOrNewestOpportunity.pipelineStage = stage;
    activeOrNewestOpportunity.pipelineStageId = stage.id;
    await this.opportunityRepository.save(activeOrNewestOpportunity);

    this.gatewayEventService.emit(`resource-pipelines`, {
      eventType: 'pipeline-stage-changed',
      data: { opportunityId: activeOrNewestOpportunity.id, stageId: stage.id },
    });
  }
}
