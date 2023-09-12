import { AbstractSimpleQueueProducer } from './abstract-simple-queue.producer';
import { EventPublisher } from './event-publisher.interface';
import { JobPro, JobsProOptions } from '@taskforcesh/bullmq-pro';

export interface QueueProducerAddOptions extends JobsProOptions {
  // re-add job even if jid already exists
  readonly forceAdd?: boolean;
}

export abstract class AbstractQueueProducer extends AbstractSimpleQueueProducer {
  protected abstract readonly eventPublisher: EventPublisher;

  protected async addInternal(
    name: string,
    data: unknown,
    opts?: QueueProducerAddOptions
  ): Promise<JobPro> {
    const job = await super.addInternal(name, data, opts);
    this.eventPublisher.emit(job, 'added');
    return job;
  }
}
