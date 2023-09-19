import { ConsoleLogger } from '@nestjs/common';
import { Job } from '@taskforcesh/bullmq-pro';
import { OnWorkerEvent, WorkerHost } from '@taskforcesh/nestjs-bullmq-pro';

export abstract class AbstractSimpleQueueProcessor<JobData> extends WorkerHost {
  protected omitResult = false;
  protected logStart = false;

  protected constructor(protected readonly logger: ConsoleLogger) {
    super();
  }

  @OnWorkerEvent('active')
  public async onStart(job: Job<JobData>): Promise<void> {
    const message = `Queue [${job.name}][${
      job.id
    }] started, payload: "${JSON.stringify(job.data)}"`;
    if (this.logStart) {
      this.logger.log(message);
    } else {
      this.logger.debug(message);
    }
  }

  @OnWorkerEvent('stalled')
  public onStalled(jobId: string): void {
    this.logger.debug(`Queue [${jobId}] stalled`);
  }

  @OnWorkerEvent('completed')
  public async onCompleted(job: Job<JobData>, result: unknown): Promise<void> {
    this.logger.debug(
      `Queue [${job.name}][${job.id}] completed, result: "${JSON.stringify(
        result,
      )}"`,
    );
    try {
      await job.updateProgress(100);
    } catch (e) {
      // ignore
    }
  }

  @OnWorkerEvent('failed')
  public onFailed(job: Job<JobData>, err: Error): void {
    this.logger.debug(
      `Queue [${job.name}][${job.id}] failed, error: "${JSON.stringify(err)}"`,
    );
  }

  @OnWorkerEvent('error')
  public onError(err: Error): void {
    this.logger.error(
      `Queue thrown unhandled exception, error: "${JSON.stringify(err)}"`,
    );
  }
}
