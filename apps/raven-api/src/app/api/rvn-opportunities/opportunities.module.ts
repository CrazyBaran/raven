import { Module, ParseUUIDPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OpportunityEntity } from './entities/opportunity.entity';
import { OrganisationEntity } from './entities/organisation.entity';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullService } from '../../core/bull.service';
import { AffinityIntegrationModule } from '../rvn-affinity-integration/affinity-integration.module';
import { PipelineDefinitionEntity } from '../rvn-pipeline/entities/pipeline-definition.entity';
import { PipelineStageEntity } from '../rvn-pipeline/entities/pipeline-stage.entity';
import { PipelineModule } from '../rvn-pipeline/pipeline.module';
import { TagEntity } from '../rvn-tags/entities/tag.entity';

import { WebSocketsModule } from '../rvn-web-sockets/web-sockets.module';

import { AffinityOrganisationCreatedEventHandler } from './event-handlers/affinity-organization-created.event-handler';

import { ParseTemplateWithGroupsAndFieldsPipe } from '../../shared/pipes/parse-template-with-groups-and-fields.pipe';
import { TemplateEntity } from '../rvn-templates/entities/template.entity';
import { AffinityFieldChangedEventHandler } from './event-handlers/affinity-field-changed.event-handler';
import { AffinityRegenerationFinishedEventHandler } from './event-handlers/affinity-regeneration-finished.event-handler';
import { AffinityStatusChangedEventHandler } from './event-handlers/affinity-status-changed.event-handler';
import { ORGANISATION_QUEUE } from './opportunities.const';
import { OpportunityController } from './opportunity.controller';
import { OpportunityService } from './opportunity.service';
import { OrganisationController } from './organisation.controller';
import { OrganisationService } from './organisation.service';
import { OrganisationProcessor } from './queues/organisation.processor';
import { OrganisationProducer } from './queues/organisation.producer';

@Module({
  imports: [
    BullService.registerQueue([
      {
        name: ORGANISATION_QUEUE,
        order: 0,
        description: 'Organisation queue',
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
      TemplateEntity,
    ]),
    AffinityIntegrationModule,
    EventEmitterModule,
    PipelineModule,
    WebSocketsModule,
  ],
  providers: [
    OrganisationService,
    OpportunityService,
    OrganisationProducer,
    OrganisationProcessor,
    AffinityRegenerationFinishedEventHandler,
    AffinityOrganisationCreatedEventHandler,
    AffinityStatusChangedEventHandler,
    AffinityFieldChangedEventHandler,
    ParseUUIDPipe,
    ParseTemplateWithGroupsAndFieldsPipe,
  ],
  controllers: [OrganisationController, OpportunityController],
})
export class OpportunitiesModule {}
