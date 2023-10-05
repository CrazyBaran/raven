import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bull';
import { environment } from '../../../../environments/environment';
import { AFFINITY_QUEUE, AFFINITY_QUEUE__REGENERATE } from '../affinity.const';
import { AffinityProducerLogger } from './affinity.producer.logger';

@Injectable()
export class AffinityProducer implements OnModuleInit {
  public constructor(
    @InjectQueue(AFFINITY_QUEUE) private readonly affinityQueue: Queue,
    private readonly affinityProducerLogger: AffinityProducerLogger,
  ) {}

  public async enqueueRegenerateAffinityData(): Promise<void> {
    await this.affinityQueue.add(AFFINITY_QUEUE__REGENERATE, {});
  }

  public async onModuleInit(): Promise<void> {
    if (!environment.affinity.enabledOnInit) {
      this.affinityProducerLogger.warn(
        'Affinity is disabled. Skipping regenerating cache.',
      );
      return;
    }
    await this.enqueueRegenerateAffinityData();
  }
}
