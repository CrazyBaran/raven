import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from '@taskforcesh/bullmq-pro';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { DWH_QUEUE } from '../data-warehouse.const';

@Injectable()
export class DataWarehouseProducer {
  public constructor(
    @InjectQueue(DWH_QUEUE.NAME) private readonly queue: Queue,
    private readonly logger: RavenLogger,
  ) {
    this.logger.setContext(DataWarehouseProducer.name);
  }

  public async enqueueRegenerateDataWarehouse(): Promise<void> {
    const existingJob = await this.queue.getJob(DWH_QUEUE.JOBS.REGENERATE);

    const state = existingJob ? await existingJob.getState() : null;
    if (state && state !== 'completed' && state !== 'failed') {
      this.logger.warn(
        'Cache regeneration job is still active when queueing another one',
      );
      return;
    }

    if (!(await this.cleanProxyRegenerationJobs())) {
      this.logger.warn(
        'Proxy regeneration job is still active when queueing cache regeneration job',
      );
      return;
    }

    if (existingJob) {
      await existingJob.remove();
    }

    await this.queue.add(
      DWH_QUEUE.JOBS.REGENERATE,
      {},
      {
        jobId: DWH_QUEUE.JOBS.REGENERATE,
      },
    );
  }

  public async enqueueRegenerateStatic(): Promise<void> {
    await this.queue.add(
      DWH_QUEUE.JOBS.REGENERATE_STATIC,
      {},
      {
        jobId: DWH_QUEUE.JOBS.REGENERATE_STATIC,
      },
    );
  }

  public async enqueueRegenerateProxy(
    skip?: number,
    take?: number,
  ): Promise<void> {
    await this.queue.add(
      DWH_QUEUE.JOBS.REGENERATE_PROXY,
      {
        options: { skip, take },
      },
      {
        jobId: `${DWH_QUEUE.JOBS.REGENERATE_PROXY}-${skip}-${take}`,
      },
    );
  }

  private async cleanProxyRegenerationJobs(): Promise<boolean> {
    const jobs = await this.queue.getJobs();
    const proxyJobs = jobs.filter((job) =>
      job.id.startsWith(DWH_QUEUE.JOBS.REGENERATE_PROXY),
    );

    // if any of the proxy jobs is active, return false
    const activeProxyJob = proxyJobs.find((job) => job.isActive());
    if (activeProxyJob) {
      return false;
    }

    // remove all proxy jobs
    await Promise.all(proxyJobs.map((job) => job.remove()));

    return true;
  }
}
