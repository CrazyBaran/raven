import { AbstractSimpleQueueProcessor } from '@app/rvns-bull';
import { JobPro } from '@taskforcesh/bullmq-pro';
import { Processor } from '@taskforcesh/nestjs-bullmq-pro';
import {
  AFFINITY_QUEUE,
  AFFINITY_QUEUE__HANDLE_WEBHOOK,
  AFFINITY_QUEUE__REGENERATE,
  AFFINITY_QUEUE__SETUP_WEBHOOK,
} from '../affinity.const';
import { AffinityService } from '../affinity.service';
import { AffinityProcessorLogger } from './affinity.processor.logger';

export interface AffinityJobData<EncryptedType = Record<string, string>> {
  body: EncryptedType;
}

@Processor(AFFINITY_QUEUE, {
  concurrency: 6,
  group: { concurrency: 3 },
  removeOnComplete: { age: 2592000 },
})
export class AffinityProcessor extends AbstractSimpleQueueProcessor<AffinityJobData> {
  public constructor(
    private readonly affinityService: AffinityService,
    public readonly logger: AffinityProcessorLogger,
  ) {
    super(logger);
  }

  public async process(
    job: JobPro,
    token: string | undefined,
  ): Promise<boolean> {
    switch (job.name) {
      case AFFINITY_QUEUE__REGENERATE: {
        await this.affinityService.regenerateAffinityData();
        return true;
      }
      case AFFINITY_QUEUE__HANDLE_WEBHOOK: {
        await this.affinityService.handleWebhookPayload(job.data.body);
        return true;
      }
      case AFFINITY_QUEUE__SETUP_WEBHOOK: {
        await this.affinityService.setupWebhook();
        return true;
      }
      default: {
        throw new Error(`Unknown job name: ${job.name}`);
      }
    }
  }
}
