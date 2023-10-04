import { Processor } from '@taskforcesh/nestjs-bullmq-pro';
import { AffinityQueueService } from './affinity-queue.service';
import { JobPro } from '@taskforcesh/bullmq-pro';
import {
  AFFINITY_QUEUE,
  AFFINITY_QUEUE__REGENERATE,
} from './affinity-queue.const';
import { AbstractSimpleQueueProcessor } from '@app/rvns-bull';
import { CommEmailTemplatesEnum } from '../../rvn-comm/templates/comm-email-templates.enum';
import { EmailRecipients } from '@azure/communication-email';
import { AffinityProcessorLogger } from './affinity.processor.logger';

export interface AffinityJobData<EncryptedType = Record<string, string>> {
  readonly template: CommEmailTemplatesEnum;
  readonly templateArgs: {
    readonly raw?: Record<string, string>;
    readonly encrypted?: EncryptedType;
  };
  readonly subject: string;
  readonly recipients: EmailRecipients;
}

@Processor(AFFINITY_QUEUE, {
  concurrency: 6,
  group: { concurrency: 3 },
  removeOnComplete: { age: 2592000 },
})
export class AffinityProcessor extends AbstractSimpleQueueProcessor<AffinityJobData> {
  public constructor(
    private readonly affinityQueueService: AffinityQueueService,
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
        await this.affinityQueueService.regenerateAffinityData();
        return true;
      }
      default: {
        throw new Error(`Unknown job name: ${job.name}`);
      }
    }
  }
}
