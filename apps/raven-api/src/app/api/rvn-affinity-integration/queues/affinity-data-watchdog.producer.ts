import { RavenLogger } from '../../rvn-logger/raven.logger';
import { InjectQueue } from '@nestjs/bullmq';
import { AFFINITY_DATA_WATCHDOG, AFFINITY_QUEUE } from '../affinity.const';
import { Queue } from '@taskforcesh/bullmq-pro';
import { OnModuleInit } from '@nestjs/common';
import { AffinityDataWatchdogJobData } from './affinity-data-watchdog.processor';
import { environment } from '../../../../environments/environment';

export class AffinityDataWatchdogProducer implements OnModuleInit{
  public constructor(
    private readonly logger: RavenLogger,
    @InjectQueue(AFFINITY_DATA_WATCHDOG) private readonly affinityDataWatchdogQueue: Queue,
  ) {

  }

  public async onModuleInit(): Promise<void> {
        if(environment.affinity.dataWatchdogEnabled) {
          await this.affinityDataWatchdogQueue.add('AffinityDataWatchdogJob', {} as AffinityDataWatchdogJobData, {
            repeat: { every: 1000 * 60 }
          });
        }
    }
}
