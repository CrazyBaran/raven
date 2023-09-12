import { AbstractSimpleQueueProcessor } from './abstract-simple-queue.processor';
import { EventPublisher } from './event-publisher.interface';
import { ConsoleLogger } from '@nestjs/common';
import { Job } from '@taskforcesh/bullmq-pro';
import { OnWorkerEvent } from '@taskforcesh/nestjs-bullmq-pro';

export interface MsOutput<DataType = unknown[]> {
  readonly success: boolean;
  readonly data: DataType;
  readonly errors: string[];
  readonly debug: string[];
}

type JobLogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export abstract class AbstractQueueProcessor<
  JobData
> extends AbstractSimpleQueueProcessor<JobData> {
  protected omitResult = false;

  protected constructor(
    protected readonly eventPublisher: EventPublisher,
    protected readonly logger: ConsoleLogger
  ) {
    super(logger);
  }

  @OnWorkerEvent('active')
  public async onStart(job: Job<JobData>): Promise<void> {
    await super.onStart(job);
    !this.eventPublisher || this.eventPublisher.emit(job, 'started');
  }

  @OnWorkerEvent('completed')
  public async onCompleted(job: Job<JobData>, result: MsOutput): Promise<void> {
    await super.onCompleted(job, result);
    !this.eventPublisher || this.eventPublisher.emit(job, 'completed');
  }

  @OnWorkerEvent('failed')
  public onFailed(job: Job<JobData>, err: Error): void {
    super.onFailed(job, err);
    !this.eventPublisher || this.eventPublisher.emit(job, 'failed');
  }

  protected async logJob(
    job: Job<JobData>,
    error: Error | string,
    level: JobLogLevel = 'debug'
  ): Promise<void> {
    await job.log(
      `[Attempt #${job.attemptsMade}][${level}] ${
        (error as Error).message ? (error as Error).message : error
      }`
    );
  }
}
