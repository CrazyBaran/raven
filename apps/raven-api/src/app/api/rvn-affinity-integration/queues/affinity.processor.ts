import { AbstractSimpleQueueProcessor } from '@app/rvns-bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JobPro } from '@taskforcesh/bullmq-pro';
import { Processor } from '@taskforcesh/nestjs-bullmq-pro';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { AffinityWebhookService } from '../affinity-webhook.service';
import {
  AFFINITY_QUEUE,
  AFFINITY_QUEUE__HANDLE_WEBHOOK,
  AFFINITY_QUEUE__REGENERATE,
  AFFINITY_QUEUE__SETUP_WEBHOOK,
} from '../affinity.const';
import { AffinityService } from '../affinity.service';

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
    private readonly affinityWebhookService: AffinityWebhookService,
    public readonly logger: RavenLogger,
    private readonly eventEmitter: EventEmitter2,
  ) {
    logger.setContext(AffinityProcessor.name);
    super(logger);
  }

  public async process(job: JobPro): Promise<boolean> {
    switch (job.name) {
      case AFFINITY_QUEUE__REGENERATE: {
        await this.affinityService.regenerateAffinityData();
        this.eventEmitter.emit('affinity.regeneration.finished');
        return true;
      }
      case AFFINITY_QUEUE__HANDLE_WEBHOOK: {
        this.logger.debug('Handling webhook payload');
        this.logger.debug(job.data.body);
        await this.affinityWebhookService.handleWebhookPayload(job.data.body);
        return true;
      }
      case AFFINITY_QUEUE__SETUP_WEBHOOK: {
        await this.affinityWebhookService.setupWebhook();
        return true;
      }
      default: {
        throw new Error(`Unknown job name: ${job.name}`);
      }
    }
  }
}
