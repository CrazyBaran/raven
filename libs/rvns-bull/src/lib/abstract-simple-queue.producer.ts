import * as _ from 'lodash';

import { JobPro, JobsProOptions, Queue } from '@taskforcesh/bullmq-pro';

export interface QueueProducerAddOptions extends JobsProOptions {
  // re-add job even if jid already exists
  readonly forceAdd?: boolean;
}

export abstract class AbstractSimpleQueueProducer {
  protected abstract readonly queue: Queue;

  protected constructor(protected readonly optimize = true) {}

  public async add<T = unknown>(
    name: string,
    data: T,
    opts?: QueueProducerAddOptions
  ): Promise<JobPro | undefined> {
    if (this.optimize) {
      const jobs = await this.queue.getJobs(['waiting']);
      // add only if other job with the same data object is not already waiting in the queue
      if (jobs.filter((j) => _.isEqual(j.data, data)).length === 0) {
        return this.addInternal(name, data, opts);
      }
      return;
    }
    return this.addInternal(name, data, opts);
  }

  protected async addInternal(
    name: string,
    data: unknown,
    opts?: QueueProducerAddOptions
  ): Promise<JobPro> {
    if (opts.forceAdd && opts.jobId) {
      await this.queue.remove(opts.jobId);
    }
    return this.queue.add(name, data, opts);
  }
}
