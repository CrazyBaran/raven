import { AffinityStatusChangedEvent } from '@app/rvns-affinity-integration';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { PipelineDefinitionEntity } from '../../rvn-pipeline/entities/pipeline-definition.entity';
import { GatewayEventService } from '../../rvn-web-sockets/gateway/gateway-event.service';
import { OpportunityEntity } from '../entities/opportunity.entity';

@Injectable()
export class AffinityStatusChangedEventHandler {
  public constructor(
    @InjectRepository(PipelineDefinitionEntity)
    private readonly pipelineRepository: Repository<PipelineDefinitionEntity>,
    @InjectRepository(OpportunityEntity)
    private readonly opportunityRepository: Repository<OpportunityEntity>,
    private readonly logger: RavenLogger,
    private readonly gatewayEventService: GatewayEventService,
  ) {
    this.logger.setContext(AffinityStatusChangedEventHandler.name);
  }

  @OnEvent('affinity-status-changed')
  protected async process(event: AffinityStatusChangedEvent): Promise<void> {
    try {
      const opportunities = await this.opportunityRepository.find({
        where: {
          organisation: { domains: Like(`%${event.organisationDomains[0]}%`) },
        },
        relations: ['organisation', 'pipelineDefinition'],
        order: { createdAt: 'DESC' },
      });
      if (opportunities.length === 0) {
        this.logger.debug(
          `No opportunities found for organisation ${event.organisationDomains[0]}`,
        );
        return;
      }

      const opportunity = opportunities[0];
      const pipelineDefinition = opportunity.pipelineDefinition;
      if (!pipelineDefinition) {
        throw new Error(
          `Cannot find pipeline definition for opportunity ${opportunities[0].id}!`,
        );
      }

      const stage = pipelineDefinition.stages.find(
        (stage) => stage.mappedFrom === event.targetStatusName,
      );
      if (!stage) {
        throw new Error(
          `Cannot find stage with mappedFrom ${event.targetStatusName}!`,
        );
      }

      opportunity.pipelineStage = stage;
      opportunity.pipelineStageId = stage.id;
      await this.opportunityRepository.save(opportunity);

      this.gatewayEventService.emit(`resource-pipelines`, {
        eventType: 'pipeline-stage-changed',
        data: { opportunityId: opportunity.id, stageId: stage.id },
      });
    } catch (err) {
      this.logger.error(err);
      throw err; // TODO remove debug
    }
  }
}
