import { InjectQueue } from '@nestjs/bullmq';
import { OnModuleInit } from '@nestjs/common';
import { Queue } from '@taskforcesh/bullmq-pro';
import { environment } from '../../../../environments/environment';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { AFFINITY_DATA_WATCHDOG } from '../affinity.const';
import { AffinityDataWatchdogJobData } from './affinity-data-watchdog.processor';

export class AffinityDataWatchdogProducer implements OnModuleInit {
  public constructor(
    private readonly logger: RavenLogger,
    @InjectQueue(AFFINITY_DATA_WATCHDOG)
    private readonly affinityDataWatchdogQueue: Queue,
  ) {
    this.logger.setContext(AffinityDataWatchdogProducer.name);
  }

  public async onModuleInit(): Promise<void> {
    if (environment.affinity.dataWatchdogEnabled) {
      await this.affinityDataWatchdogQueue.add(
        'AffinityDataWatchdogJob',
        {} as AffinityDataWatchdogJobData,
        {
          repeat: { every: 1000 * 60 },
        },
      );
    }
  }
}
