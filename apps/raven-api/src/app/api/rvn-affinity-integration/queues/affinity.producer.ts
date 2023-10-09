import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bull';
import { environment } from '../../../../environments/environment';
import {
  AFFINITY_QUEUE,
  AFFINITY_QUEUE__HANDLE_WEBHOOK,
  AFFINITY_QUEUE__REGENERATE,
  AFFINITY_QUEUE__SETUP_WEBHOOK,
} from '../affinity.const';
import { WebhookPayloadDto } from '../api/dtos/webhook-payload.dto';
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
    if (environment.affinity.enabledOnInit) {
      await this.enqueueRegenerateAffinityData();
    } else {
      this.affinityProducerLogger.warn(
        'Affinity is disabled. Skipping regenerating cache.',
      );
    }
    if (environment.affinity.webhookToken) {
      await this.enqueueSetupWebhook();
    } else {
      this.affinityProducerLogger.warn(
        'Webhook token is not set. Skipping webhook setup.',
      );
    }
  }

  public async enqueueHandleWebhook(body: WebhookPayloadDto): Promise<void> {
    await this.affinityQueue.add(AFFINITY_QUEUE__HANDLE_WEBHOOK, { body });
  }

  public async enqueueSetupWebhook(): Promise<void> {
    await this.affinityQueue.add(AFFINITY_QUEUE__SETUP_WEBHOOK, {});
  }
}
