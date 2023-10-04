import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffinityOrganisation } from './entities/affinity-organisation.entity';
import { AffinityApiService } from './affinity-api.service';
import { AffinityApiController } from './affinity-api.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AffinityProcessor } from './queues/affinity.processor';
import { AffinityQueueService } from './queues/affinity-queue.service';
import { AffinitySettingsService } from './affinity-settings.service';
import { BullService } from '../../core/bull.service';
import { AFFINITY_QUEUE } from './queues/affinity-queue.const';
import { AffinityProcessorLogger } from './queues/affinity.processor.logger';
import { AffinityController } from './affinity.controller';
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
    TypeOrmModule.forFeature([AffinityOrganisation]),
    HttpModule,
    ConfigModule,
  ],
  providers: [
    AffinityApiService,
    AffinityProcessor,
    AffinityQueueService,
    AffinitySettingsService,
    AffinityProcessorLogger,
    AffinityProducer,
  ],
  controllers: [AffinityApiController, AffinityController],
})
export class AffinityIntegrationModule {}
