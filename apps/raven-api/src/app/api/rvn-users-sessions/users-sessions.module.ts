import { CryptoModule } from '@app/rvnb-crypto';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '../../../environments/environment';
import { UserSessionEntity } from './entities/user-session.entity';
import { InvalidateSessionEventHandlerLogger } from './event-handlers/invalidate-session-event-handler.logger';
import { InvalidateSessionEventHandler } from './event-handlers/invalidate-session.event-handler';
import { UsersSessionsService } from './users-sessions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSessionEntity]),
    CryptoModule.register({
      key: environment.security.crypto.key,
      initVector: environment.security.crypto.initVector,
    }),
  ],
  providers: [
    UsersSessionsService,
    InvalidateSessionEventHandler,
    InvalidateSessionEventHandlerLogger,
  ],
  exports: [UsersSessionsService],
})
export class UsersSessionsModule {}
