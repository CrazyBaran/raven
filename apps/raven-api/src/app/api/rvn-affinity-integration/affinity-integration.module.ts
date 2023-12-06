import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullService } from '../../core/bull.service';
import { PipelineDefinitionEntity } from '../rvn-pipeline/entities/pipeline-definition.entity';
import { WebSocketsModule } from '../rvn-web-sockets/web-sockets.module';
import { AffinitySettingsService } from './affinity-settings.service';
import { AffinityValueResolverService } from './affinity-value-resolver.service';
import { AffinityWebhookService } from './affinity-webhook.service';
import { AFFINITY_QUEUE } from './affinity.const';
import { AffinityController } from './affinity.controller';
import { AffinityService } from './affinity.service';
import { AffinityApiService } from './api/affinity-api.service';
import { AffinityCacheService } from './cache/affinity-cache.service';
import { AffinityEnricher } from './cache/affinity.enricher';
import { OpportunityStageChangedEventHandler } from './event-handlers/opportunity-stage-changed.event-handler';
import { AffinityProcessor } from './queues/affinity.processor';
import { AffinityProducer } from './queues/affinity.producer';

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
    WebSocketsModule,
    TypeOrmModule.forFeature([PipelineDefinitionEntity]),
  ],
  providers: [
    AffinityApiService,
    AffinityProcessor,
    AffinityService,
    AffinitySettingsService,
    AffinityProducer,
    AffinityCacheService,
    OpportunityStageChangedEventHandler,
    AffinityWebhookService,
    AffinityValueResolverService,
    AffinityEnricher,
  ],
  controllers: [AffinityController],
  exports: [AffinityCacheService, AffinityEnricher],
})
export class AffinityIntegrationModule {}
