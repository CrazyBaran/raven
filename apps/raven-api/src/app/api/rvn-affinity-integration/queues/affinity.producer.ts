import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from '@taskforcesh/bullmq-pro';
import { environment } from '../../../../environments/environment';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import {
  AFFINITY_QUEUE,
  AFFINITY_QUEUE__HANDLE_WEBHOOK,
  AFFINITY_QUEUE__REGENERATE,
  AFFINITY_QUEUE__SETUP_WEBHOOK,
} from '../affinity.const';
import { WebhookPayloadDto } from '../api/dtos/webhook-payload.dto';

@Injectable()
export class AffinityProducer implements OnModuleInit {
  public constructor(
    private readonly logger: RavenLogger,
    @InjectQueue(AFFINITY_QUEUE) private readonly affinityQueue: Queue,
  ) {
    this.logger.setContext(AffinityProducer.name);
  }

  public async enqueueRegenerateAffinityData(): Promise<void> {
    await this.affinityQueue.add(AFFINITY_QUEUE__REGENERATE, {});
  }

  public async onModuleInit(): Promise<void> {
    if (environment.affinity.enabledOnInit) {
      await this.enqueueRegenerateAffinityData();
    } else {
      this.logger.warn('Affinity is disabled. Skipping regenerating cache.');
    }
    if (environment.affinity.webhookToken) {
      await this.enqueueSetupWebhook();
    } else {
      this.logger.warn('Webhook token is not set. Skipping webhook setup.');
    }
  }

  public async enqueueHandleWebhook(body: WebhookPayloadDto): Promise<void> {
    await this.affinityQueue.add(AFFINITY_QUEUE__HANDLE_WEBHOOK, { body });
  }

  public async enqueueSetupWebhook(): Promise<void> {
    await this.affinityQueue.add(AFFINITY_QUEUE__SETUP_WEBHOOK, {});
  }
}
