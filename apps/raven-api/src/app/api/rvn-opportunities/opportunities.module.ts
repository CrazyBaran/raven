import { Module, ParseUUIDPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OpportunityEntity } from './entities/opportunity.entity';
import { OrganisationEntity } from './entities/organisation.entity';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullService } from '../../core/bull.service';
import { AffinityIntegrationModule } from '../rvn-affinity-integration/affinity-integration.module';
import { PipelineModule } from '../rvn-pipeline/pipeline.module';
import { TagEntity } from '../rvn-tags/entities/tag.entity';

import { WebSocketsModule } from '../rvn-web-sockets/web-sockets.module';

import { AffinityOrganisationCreatedEventHandler } from './event-handlers/affinity-organization-created.event-handler';

import { ParseTemplateWithGroupsAndFieldsPipe } from '../../shared/pipes/parse-template-with-groups-and-fields.pipe';
import { ShareOpportunityEntity } from '../rvn-acl/entities/share-opportunity.entity';
import { DataWarehouseModule } from '../rvn-data-warehouse/data-warehouse.module';
import { FilesModule } from '../rvn-files/files.module';
import { ShortlistsModule } from '../rvn-shortlists/shortlists.module';
import { TemplateEntity } from '../rvn-templates/entities/template.entity';
import { DuplicateDetector } from './duplicate.detector';
import { DuplicatesController } from './duplicates.controller';
import { OrganisationDomainEntity } from './entities/organisation-domain.entity';
import { AffinityFieldChangedEventHandler } from './event-handlers/affinity-field-changed.event-handler';
import { AffinityRegenerationFinishedEventHandler } from './event-handlers/affinity-regeneration-finished.event-handler';
import { AffinityStatusChangedEventHandler } from './event-handlers/affinity-status-changed.event-handler';
import { DataWarehouseRegenerationFinishedEventHandler } from './event-handlers/data-warehouse-regeneration-finished.event-handler';
import { OrganisationPassedEventHandler } from './event-handlers/organisation-passed.event-handler';
import { ORGANISATION_QUEUE } from './opportunities.const';
import { OpportunityTeamService } from './opportunity-team.service';
import { OpportunityChecker } from './opportunity.checker';
import { OpportunityController } from './opportunity.controller';
import { OpportunityService } from './opportunity.service';
import { OrganisationController } from './organisation.controller';
import { OrganisationService } from './organisation.service';
import { OrganisationProcessor } from './queues/organisation.processor';
import { OrganisationProducer } from './queues/organisation.producer';

@Module({
  imports: [
    DataWarehouseModule.forRootAsync(),
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
      TagEntity,
      TemplateEntity,
      ShareOpportunityEntity,
      OrganisationDomainEntity,
    ]),
    AffinityIntegrationModule,
    EventEmitterModule,
    PipelineModule,
    WebSocketsModule,
    FilesModule,
    ShortlistsModule,
  ],
  providers: [
    OrganisationService,
    OpportunityService,
    OpportunityTeamService,
    OrganisationProducer,
    OrganisationProcessor,
    AffinityRegenerationFinishedEventHandler,
    AffinityOrganisationCreatedEventHandler,
    AffinityStatusChangedEventHandler,
    AffinityFieldChangedEventHandler,
    OrganisationPassedEventHandler,
    DataWarehouseRegenerationFinishedEventHandler,
    ParseUUIDPipe,
    ParseTemplateWithGroupsAndFieldsPipe,
    OpportunityChecker,
    DuplicateDetector,
  ],
  controllers: [
    OrganisationController,
    OpportunityController,
    DuplicatesController,
  ],
})
export class OpportunitiesModule {}
