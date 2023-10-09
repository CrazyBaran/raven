import { AbstractSimpleQueueProcessor } from '@app/rvns-bull';
import { JobPro } from '@taskforcesh/bullmq-pro';
import { Processor } from '@taskforcesh/nestjs-bullmq-pro';
import {
  OPPORTUNITY_QUEUE,
  OPPORTUNITY_QUEUE__ENSURE_ALL_AFFINITY_ENTRIES_AS_OPPORTUNITIES,
} from '../opportunities.const';
import { OpportunityService } from '../opportunity.service';
import { OpportunityProcessorLogger } from './opportunity.processor.logger';

export interface AffinityJobData<EncryptedType = Record<string, string>> {
  body: EncryptedType;
}

@Processor(OPPORTUNITY_QUEUE, {
  concurrency: 1,
  group: { concurrency: 1 },
  removeOnComplete: { age: 2592000 },
})
export class OpportunityProcessor extends AbstractSimpleQueueProcessor<AffinityJobData> {
  public constructor(
    private readonly opportunityService: OpportunityService,
    public readonly logger: OpportunityProcessorLogger,
  ) {
    super(logger);
  }

  public async process(
    job: JobPro,
    token: string | undefined,
  ): Promise<boolean> {
    switch (job.name) {
      case OPPORTUNITY_QUEUE__ENSURE_ALL_AFFINITY_ENTRIES_AS_OPPORTUNITIES: {
        await this.opportunityService.ensureAllAffinityEntriesAsOpportunities();
        return true;
      }
      default: {
        throw new Error(`Unknown job name: ${job.name}`);
      }
    }
  }
}
