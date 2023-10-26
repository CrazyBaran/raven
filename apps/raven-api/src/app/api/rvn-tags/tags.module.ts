import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisationEntity } from '../rvn-opportunities/entities/organisation.entity';
import { ComplexTagEntity } from './entities/complex-tag.entity';
import { OrganisationTagEntity, TagEntity } from './entities/tag.entity';
import { OrganisationCreatedEventHandler } from './event-handlers/organisation-created.event-handler';
import { UserRegisteredEventHandler } from './event-handlers/user-registered.event-handler';
import { OrganisationTagSyncServiceLogger } from './organisation-tag-sync-service.logger';
import { OrganisationTagSyncService } from './organisation-tag-sync.service';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TagEntity,
      ComplexTagEntity,
      OrganisationEntity,
      OrganisationTagEntity,
    ]),
  ],
  providers: [
    TagsService,
    UserRegisteredEventHandler,
    OrganisationCreatedEventHandler,
    OrganisationTagSyncService,
    OrganisationTagSyncServiceLogger,
  ],
  controllers: [TagsController],
})
export class TagsModule {}
