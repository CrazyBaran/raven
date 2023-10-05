import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { AFFINITY_QUEUE, AFFINITY_QUEUE__REGENERATE } from '../affinity.const';

@Injectable()
export class AffinityProducer implements OnModuleInit {
  public constructor(
    @InjectQueue(AFFINITY_QUEUE) private readonly affinityQueue: Queue,
  ) {}

  public async enqueueRegenerateAffinityData(): Promise<void> {
    await this.affinityQueue.add(AFFINITY_QUEUE__REGENERATE, {});
  }

  public async onModuleInit(): Promise<void> {
    await this.enqueueRegenerateAffinityData();
  }
}
