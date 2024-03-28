import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisationEntity } from '../rvn-opportunities/entities/organisation.entity';
import { WebSocketsModule } from '../rvn-web-sockets/web-sockets.module';
import { ShortlistContributorEntity } from './entities/shortlist-contributor.entity';
import { ShortlistOrganisationEntity } from './entities/shortlist-organisation.entity';
import { ShortlistEntity } from './entities/shortlist.entity';
import { OpportunityStageChangedEventHandler } from './event-handlers/opportuinuty-stage-changed.event-handler';
import { UserRegisteredEventHandler } from './event-handlers/user-registered.event-handler';
import { ShortlistsController } from './shortlists.controller';
import { ShortlistsService } from './shortlists.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShortlistEntity,
      ShortlistOrganisationEntity,
      ShortlistContributorEntity,
      OrganisationEntity,
    ]),
    WebSocketsModule,
  ],
  controllers: [ShortlistsController],
  providers: [
    ShortlistsService,
    UserRegisteredEventHandler,
    OpportunityStageChangedEventHandler,
  ],
  exports: [ShortlistsService],
})
export class ShortlistsModule {}
