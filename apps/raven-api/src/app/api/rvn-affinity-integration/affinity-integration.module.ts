import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffinityOrganisation } from './entities/affinity-organisation.entity';
import { AffinityApiService } from './api/affinity-api.service';
import { AffinityApiController } from './api/affinity-api.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AffinityProcessor } from './queues/affinity.processor';
import { AffinityService } from './affinity.service';
import { AffinitySettingsService } from './affinity-settings.service';
import { BullService } from '../../core/bull.service';
import { AFFINITY_QUEUE } from './affinity.const';
import { AffinityProcessorLogger } from './queues/affinity.processor.logger';
import { AffinityController } from './affinity.controller';
import { AffinityProducer } from './queues/affinity.producer';
import { AffinityServiceLogger } from './affinity.service.logger';
import { AffinityCacheService } from './cache/affinity-cache.service';

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
    TypeOrmModule.forFeature([AffinityOrganisation]),
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
    AffinityServiceLogger,
    AffinityCacheService,
  ],
  controllers: [AffinityApiController, AffinityController],
})
export class AffinityIntegrationModule {}
