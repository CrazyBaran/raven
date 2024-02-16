import { AbstractSimpleQueueProcessor } from '@app/rvns-bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JobPro } from '@taskforcesh/bullmq-pro';
import { Processor } from '@taskforcesh/nestjs-bullmq-pro';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { DWH_QUEUE } from '../data-warehouse.const';
import { DataWarehouseService } from '../data-warehouse.service';

export interface DataWarehouseJobData<EncryptedType = Record<string, string>> {
  body: EncryptedType;
}

@Processor(DWH_QUEUE.NAME, {
  concurrency: 1,
  group: { concurrency: 1 },
  removeOnComplete: { age: 2592000 },
})
export class DataWarehouseProcessor extends AbstractSimpleQueueProcessor<DataWarehouseJobData> {
  public constructor(
    public readonly logger: RavenLogger,
    private readonly dataWarehouseService: DataWarehouseService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    logger.setContext(DataWarehouseProcessor.name);
    super(logger);
  }

  public async process(job: JobPro): Promise<boolean> {
    switch (job.name) {
      case DWH_QUEUE.JOBS.REGENERATE: {
        await this.dataWarehouseService.regenerateCache(job);
        this.eventEmitter.emit('data-warehouse.regeneration.finished');
        return true;
      }
      case DWH_QUEUE.JOBS.REGENERATE_STATIC: {
        await this.dataWarehouseService.regenerateStaticCache(job);
        return true;
      }
      default: {
        throw new Error(`Unknown job name: ${job.name}`);
      }
    }
  }
}
