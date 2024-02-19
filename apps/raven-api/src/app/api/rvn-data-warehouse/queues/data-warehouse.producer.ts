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
    await this.queue.add(DWH_QUEUE.JOBS.REGENERATE, {});
  }
}
