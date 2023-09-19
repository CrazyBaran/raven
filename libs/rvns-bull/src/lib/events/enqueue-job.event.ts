import { QueueProducerAddOptions } from '../abstract-queue.producer';

export class EnqueueJobEvent<JobData> {
  public constructor(
    public readonly data: JobData,
    public readonly options?: QueueProducerAddOptions,
  ) {}
}
