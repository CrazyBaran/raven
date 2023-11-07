import { AffinityStatusChangedEvent } from '@app/rvns-affinity-integration';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PipelineDefinitionEntity } from '../../rvn-pipeline/entities/pipeline-definition.entity';
import { GatewayEventService } from '../../rvn-web-sockets/gateway/gateway-event.service';
import { OpportunityEntity } from '../entities/opportunity.entity';
import { AffinityStatusChangedEventHandlerLogger } from './affinity-status-changed.event-handler.logger';

@Injectable()
export class AffinityStatusChangedEventHandler {
  public constructor(
    @InjectRepository(PipelineDefinitionEntity)
    private readonly pipelineRepository: Repository<PipelineDefinitionEntity>,
    @InjectRepository(OpportunityEntity)
    private readonly opportunityRepository: Repository<OpportunityEntity>,
    private readonly logger: AffinityStatusChangedEventHandlerLogger,
    private readonly gatewayEventService: GatewayEventService,
  ) {}

  @OnEvent('affinity-status-changed')
  protected async process(event: AffinityStatusChangedEvent): Promise<void> {
    const opportunities = await this.opportunityRepository.find({
      where: {
        organisation: { domains: Like(`%${event.organisationDomains[0]}%`) },
      },
      relations: ['organisation'],
      order: { createdAt: 'DESC' },
    });
    if (opportunities.length === 0) {
      this.logger.debug(
        `No opportunities found for organisation ${event.organisationDomains[0]}`,
      );
      return;
    }

    const pipelineDefinitions = await this.pipelineRepository.find({
      relations: ['stages'],
    });
    if (pipelineDefinitions.length !== 1) {
      throw new Error('There should be only one pipeline definition!');
    }
    const pipelineDefinition = pipelineDefinitions[0];
    const stage = pipelineDefinition.stages.find(
      (stage) => stage.mappedFrom === event.targetStatusName,
    );
    if (!stage) {
      throw new Error(
        `Cannot find stage with mappedFrom ${event.targetStatusName}!`,
      );
    }

    const opportunity = opportunities[0];
    opportunity.pipelineStage = stage;
    opportunity.pipelineStageId = stage.id;
    await this.opportunityRepository.save(opportunity);

    this.gatewayEventService.emit(`resource-pipelines`, {
      eventType: 'pipeline-stage-changed',
      data: { opportunityId: opportunity.id, stageId: stage.id },
    });
  }
}
