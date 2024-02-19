import { AbstractSimpleQueueProcessor } from '@app/rvns-bull';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { JobPro } from '@taskforcesh/bullmq-pro';
import { Processor } from '@taskforcesh/nestjs-bullmq-pro';
import { AFFINITY_CACHE, AFFINITY_DATA_WATCHDOG, AFFINITY_FIELDS_CACHE, AFFINITY_QUEUE } from '../affinity.const';
import { AffinityProducer } from './affinity.producer';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AffinityCacheService } from '../cache/affinity-cache.service';
import { RedisStore } from 'cache-manager-ioredis-yet';

export interface AffinityDataWatchdogJobData {
}

@Processor(AFFINITY_DATA_WATCHDOG, {
  concurrency: 1,
  group: { concurrency: 1 },
  removeOnComplete: { count: 10 },
})
export class AffinityDataWatchdogProcessor extends AbstractSimpleQueueProcessor<AffinityDataWatchdogJobData> {
  public constructor(
    private readonly affinityProducer: AffinityProducer,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    public readonly logger: RavenLogger,) {
    logger.setContext(AffinityDataWatchdogProcessor.name);
    super(logger);
  }

  private get store(): RedisStore {
    return this.cacheManager.store as RedisStore;
  }

  public async process(job: JobPro): Promise<boolean> {
    const listFieldsCount = await this.store.client.hlen(AFFINITY_FIELDS_CACHE);
    const affinityCacheCount = await this.store.client.hlen(AFFINITY_CACHE);
    if(listFieldsCount === 0 || affinityCacheCount === 0){
      this.logger.warn('Affinity data watchdog didnt find any data. Regenerating data.');
      this.affinityProducer.enqueueRegenerateAffinityData();
    }

    return true;
  }
}
