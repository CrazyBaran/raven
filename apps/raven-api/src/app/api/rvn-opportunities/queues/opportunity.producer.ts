import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import {
  OPPORTUNITY_QUEUE,
  OPPORTUNITY_QUEUE__ENSURE_ALL_AFFINITY_ENTRIES_AS_OPPORTUNITIES,
} from '../opportunities.const';
import { OpportunityProducerLogger } from './opportunity.producer.logger';

@Injectable()
export class OpportunityProducer {
  public constructor(
    @InjectQueue(OPPORTUNITY_QUEUE) private readonly opportunityQueue: Queue,
    private readonly affinityProducerLogger: OpportunityProducerLogger,
  ) {}

  public async ensureAllAffinityEntriesAsOpportunities(): Promise<void> {
    await this.opportunityQueue.add(
      OPPORTUNITY_QUEUE__ENSURE_ALL_AFFINITY_ENTRIES_AS_OPPORTUNITIES,
      {},
    );
  }
}
