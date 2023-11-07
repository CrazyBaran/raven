import { AffinityFieldChangedEvent } from '@app/rvns-affinity-integration';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { GatewayEventService } from '../../rvn-web-sockets/gateway/gateway-event.service';
import { OpportunityEntity } from '../entities/opportunity.entity';
import { AffinityFieldChangedEventHandlerLogger } from './affinity-field-changed.event-handler.logger';

@Injectable()
export class AffinityFieldChangedEventHandler {
  public constructor(
    @InjectRepository(OpportunityEntity)
    private readonly opportunityRepository: Repository<OpportunityEntity>,
    private readonly logger: AffinityFieldChangedEventHandlerLogger,
    private readonly gatewayEventService: GatewayEventService,
  ) {}

  @OnEvent('affinity-field-changed')
  protected async process(event: AffinityFieldChangedEvent): Promise<void> {
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

    const latestOpportunity = opportunities[0];
    this.gatewayEventService.emit(`resource-pipelines`, {
      eventType: 'opportunity-field-changed',
      data: {
        opportunityId: latestOpportunity.id,
        fields: event.fields,
      },
    });
  }
}