import { EventPublisher } from './event-publisher.interface';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from '@taskforcesh/bullmq-pro';

export abstract class AbstractQueueBroadcaster {
  protected abstract readonly queue: Queue<{ resourceId: string }>;
  protected abstract readonly eventPublisher: EventPublisher;

  @OnEvent('ws.message.join-resource')
  public async broadcastEvent(payload: { resourceId: string }): Promise<void> {
    for (const job of await this.queue.getJobs([
      'active',
      'waiting',
      'delayed',
    ])) {
      if (payload.resourceId === job.data.resourceId) {
        this.eventPublisher.emit(job, 'added', {
          progress: job.progress as number,
        });
      }
    }
  }
}
