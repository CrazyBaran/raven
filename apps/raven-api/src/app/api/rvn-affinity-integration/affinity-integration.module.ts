import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullService } from '../../core/bull.service';
import { AffinitySettingsService } from './affinity-settings.service';
import { AffinityValueResolverService } from './affinity-value-resolver.service';
import { AffinityWebhookServiceLogger } from './affinity-webhook-service.logger';
import { AffinityWebhookService } from './affinity-webhook.service';
import { AFFINITY_QUEUE } from './affinity.const';
import { AffinityController } from './affinity.controller';
import { AffinityService } from './affinity.service';
import { AffinityServiceLogger } from './affinity.service.logger';
import { AffinityApiController } from './api/affinity-api.controller';
import { AffinityApiService } from './api/affinity-api.service';
import { AffinityCacheService } from './cache/affinity-cache.service';
import { OpportunityStageChangedEventHandler } from './event-handlers/opportunity-stage-changed.event-handler';
import { AffinityProcessor } from './queues/affinity.processor';
import { AffinityProcessorLogger } from './queues/affinity.processor.logger';
import { AffinityProducer } from './queues/affinity.producer';
import { AffinityProducerLogger } from './queues/affinity.producer.logger';

@Module({
  imports: [
    BullService.registerQueue([
      {
        name: AFFINITY_QUEUE,
        order: 0,
        description: 'Communicate with Affinity',
        defaultJobOptions: {
          attempts: 3,
          // exponential fn: 2 ^ ($attempts - 1) * $delay
          backoff: { type: 'exponential', delay: 60000 },
        },
      },
    ]),
    HttpModule,
    ConfigModule,
  ],
  providers: [
    AffinityApiService,
    AffinityProcessor,
    AffinityService,
    AffinitySettingsService,
    AffinityProcessorLogger,
    AffinityProducer,
    AffinityProducerLogger,
    AffinityServiceLogger,
    AffinityCacheService,
    OpportunityStageChangedEventHandler,
    AffinityWebhookService,
    AffinityWebhookServiceLogger,
    AffinityValueResolverService,
  ],
  controllers: [AffinityApiController, AffinityController],
})
export class AffinityIntegrationModule {}
