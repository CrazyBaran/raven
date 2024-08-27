import { AbstractSimpleQueueProcessor } from '@app/rvns-bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JobPro } from '@taskforcesh/bullmq-pro';
import { Processor } from '@taskforcesh/nestjs-bullmq-pro';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { DWH_QUEUE } from '../data-warehouse.const';
import { DataWarehouseService } from '../data-warehouse.service';
import { DataWarehouseRegenerator } from '../proxy/data-warehouse.regenerator';

export interface DataWarehouseJobData {
  options?: {
    skip?: number;
    take?: number;
  };
}

@Processor(DWH_QUEUE.NAME, {
  concurrency: 1,
  group: { concurrency: 1 },
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 100 },
})
export class DataWarehouseProcessor extends AbstractSimpleQueueProcessor<DataWarehouseJobData> {
  public constructor(
    public readonly logger: RavenLogger,
    private readonly dataWarehouseService: DataWarehouseService,
    private readonly dataWarehouseRegenerator: DataWarehouseRegenerator,
    private readonly eventEmitter: EventEmitter2,
  ) {
    logger.setContext(DataWarehouseProcessor.name);
    super(logger);
  }

  public async process(job: JobPro): Promise<boolean> {
    switch (job.name) {
      case DWH_QUEUE.JOBS.REGENERATE: {
        await this.dataWarehouseService.regenerateCache(job);
        await this.dataWarehouseRegenerator.regenerateInvestors();
        await this.dataWarehouseRegenerator.regenerateIndustries();
        await this.dataWarehouseRegenerator.regenerateFundManagers();
        this.eventEmitter.emit('data-warehouse.regeneration.finished');
        return true;
      }
      case DWH_QUEUE.JOBS.REGENERATE_STATIC: {
        await this.dataWarehouseRegenerator.regenerateInvestors();
        await this.dataWarehouseRegenerator.regenerateIndustries();
        await this.dataWarehouseRegenerator.regenerateFundManagers();
        return true;
      }
      case DWH_QUEUE.JOBS.REGENERATE_PROXY: {
        await this.dataWarehouseRegenerator.regenerateProxy(
          job.data?.options?.skip,
          job.data?.options?.take,
          async (progress) => {
            await job.updateProgress(progress);
          },
        );
        return true;
      }
      default: {
        throw new Error(`Unknown job name: ${job.name}`);
      }
    }
  }
}
