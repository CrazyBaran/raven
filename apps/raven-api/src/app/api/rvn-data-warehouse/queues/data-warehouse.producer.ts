import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from '@taskforcesh/bullmq-pro';
import { DWH_QUEUE } from '../data-warehouse.const';

@Injectable()
export class DataWarehouseProducer {
  public constructor(
    @InjectQueue(DWH_QUEUE.NAME) private readonly queue: Queue,
  ) {}

  public async enqueueRegenerateDataWarehouse(): Promise<void> {
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
}
