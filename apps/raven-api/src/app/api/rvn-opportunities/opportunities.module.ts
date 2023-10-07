import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OpportunityEntity } from './entities/opportunity.entity';
import { OrganisationEntity } from './entities/organisation.entity';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { AffinityIntegrationModule } from '../rvn-affinity-integration/affinity-integration.module';
import { AffinityCacheService } from '../rvn-affinity-integration/cache/affinity-cache.service';
import { PipelineDefinitionEntity } from '../rvn-pipeline/entities/pipeline-definition.entity';
import { PipelineModule } from '../rvn-pipeline/pipeline.module';
import { PipelineService } from '../rvn-pipeline/pipeline.service';
import { NoteAssignedToAffinityOpportunityEventHandler } from './event-handlers/note-assigned-to-affinity-opportunity.event-handler';
import { OpportunityController } from './opportunity.controller';
import { OpportunityService } from './opportunity.service';
import { OrganisationController } from './organisation.controller';
import { OrganisationService } from './organisation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OpportunityEntity,
      OrganisationEntity,
      PipelineDefinitionEntity,
    ]),
    AffinityIntegrationModule,
    EventEmitterModule,
    PipelineModule,
  ],
  providers: [
    OrganisationService,
    OpportunityService,
    AffinityCacheService,
    PipelineService,
    NoteAssignedToAffinityOpportunityEventHandler,
  ],
  controllers: [OrganisationController, OpportunityController],
})
export class OpportunitiesModule {}
