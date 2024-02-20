import { AbstractSimpleQueueProcessor } from '@app/rvns-bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import * as openTelemetry from '@opentelemetry/api';
import { JobPro } from '@taskforcesh/bullmq-pro';
import { Processor } from '@taskforcesh/nestjs-bullmq-pro';
import { Cache } from 'cache-manager';
import { RedisStore } from 'cache-manager-ioredis-yet';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import {
  AFFINITY_CACHE,
  AFFINITY_DATA_WATCHDOG_QUEUE,
  AFFINITY_FIELDS_CACHE,
} from '../affinity.const';
import { AffinityProducer } from './affinity.producer';

export interface AffinityDataWatchdogJobData {}

@Processor(AFFINITY_DATA_WATCHDOG_QUEUE, {
  concurrency: 1,
  group: { concurrency: 1 },
  removeOnComplete: { count: 10 },
})
export class AffinityDataWatchdogProcessor extends AbstractSimpleQueueProcessor<AffinityDataWatchdogJobData> {
  public constructor(
    private readonly affinityProducer: AffinityProducer,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    public readonly logger: RavenLogger,
  ) {
    logger.setContext(AffinityDataWatchdogProcessor.name);
    super(logger);
  }

  private get store(): RedisStore {
    return this.cacheManager.store as RedisStore;
  }

  public async process(job: JobPro): Promise<boolean> {
    const span = openTelemetry.trace
      .getTracer(AFFINITY_DATA_WATCHDOG_QUEUE)
      .startSpan('affinity-data-watchdog-processor.process', {
        kind: openTelemetry.SpanKind.SERVER,
      });
    const ctx = openTelemetry.trace.setSpan(
      openTelemetry.context.active(),
      span,
    );
    await openTelemetry.context.with(ctx, async () => {
      try {
        const listFieldsCount = await this.store.client.hlen(
          AFFINITY_FIELDS_CACHE,
        );
        const affinityCacheCount = await this.store.client.hlen(AFFINITY_CACHE);
        if (listFieldsCount === 0 || affinityCacheCount === 0) {
          this.logger.warn(
            'Affinity data watchdog didnt find any data. Regenerating data.',
          );
          await this.affinityProducer.enqueueRegenerateAffinityData();
        }
        span.setStatus({ code: openTelemetry.SpanStatusCode.OK });
      } catch (e: unknown) {
        span.recordException(e as Error);
        throw e;
      } finally {
        span.end();
      }
    });

    return true;
  }
}
