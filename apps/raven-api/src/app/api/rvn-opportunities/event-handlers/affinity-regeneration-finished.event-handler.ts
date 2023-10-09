import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AffinityRegenerationFinishedEvent } from '../../rvn-affinity-integration/events/affinity-regeneration-finished.event';
import { OpportunityProducer } from '../queues/opportunity.producer';

@Injectable()
export class AffinityRegenerationFinishedEventHandler {
  public constructor(
    private readonly opportunityProducer: OpportunityProducer,
  ) {}

  @OnEvent(`affinity.regeneration.finished`)
  protected async process(
    event: AffinityRegenerationFinishedEvent,
  ): Promise<void> {
    await this.opportunityProducer.ensureAllAffinityEntriesAsOpportunities();
  }
}
