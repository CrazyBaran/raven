import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OpportunityEntity } from './entities/opportunity.entity';
import { OrganisationEntity } from './entities/organisation.entity';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullService } from '../../core/bull.service';
import { AffinityIntegrationModule } from '../rvn-affinity-integration/affinity-integration.module';
import { AffinityCacheService } from '../rvn-affinity-integration/cache/affinity-cache.service';
import { PipelineDefinitionEntity } from '../rvn-pipeline/entities/pipeline-definition.entity';
import { PipelineStageEntity } from '../rvn-pipeline/entities/pipeline-stage.entity';
import { PipelineModule } from '../rvn-pipeline/pipeline.module';
import { TagEntity } from '../rvn-tags/entities/tag.entity';
import { AffinityRegenerationFinishedEventHandler } from './event-handlers/affinity-regeneration-finished.event-handler';
import { OPPORTUNITY_QUEUE } from './opportunities.const';
import { OpportunityController } from './opportunity.controller';
import { OpportunityService } from './opportunity.service';
import { OrganisationController } from './organisation.controller';
import { OrganisationService } from './organisation.service';
import { OpportunityProcessor } from './queues/opportunity.processor';
import { OpportunityProcessorLogger } from './queues/opportunity.processor.logger';
import { OpportunityProducer } from './queues/opportunity.producer';
import { OpportunityProducerLogger } from './queues/opportunity.producer.logger';

@Module({
  imports: [
    BullService.registerQueue([
      {
        name: OPPORTUNITY_QUEUE,
        order: 0,
        description: 'Opportunities',
        defaultJobOptions: {
          attempts: 3,
          // exponential fn: 2 ^ ($attempts - 1) * $delay
          backoff: { type: 'exponential', delay: 60000 },
        },
      },
    ]),
    TypeOrmModule.forFeature([
      OpportunityEntity,
      OrganisationEntity,
      PipelineDefinitionEntity,
      PipelineStageEntity,
      TagEntity,
    ]),
    AffinityIntegrationModule,
    EventEmitterModule,
    PipelineModule,
  ],
  providers: [
    OrganisationService,
    OpportunityService,
    AffinityCacheService,
    OpportunityProducer,
    OpportunityProducerLogger,
    OpportunityProcessorLogger,
    OpportunityProcessor,
    AffinityRegenerationFinishedEventHandler,
  ],
  controllers: [OrganisationController, OpportunityController],
})
export class OpportunitiesModule {}
