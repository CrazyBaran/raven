import { UserEntity } from '../../rvn-users/entities/user.entity';
import { UsersSessionsService } from '../users-sessions.service';
import { InvalidateSessionEventHandlerLogger } from './invalidate-session-event-handler.logger';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class InvalidateSessionEventHandler {
  public constructor(
    private readonly service: UsersSessionsService,
    private readonly logger: InvalidateSessionEventHandlerLogger,
  ) {}

  @OnEvent('user.invalidate-session.all')
  protected async process(user: UserEntity): Promise<void> {
    try {
      await this.service.invalidateAllSessions(user);
    } catch (err) {
      this.logger.error(
        `Exception occurred while invalidating user session, message: "${err.message}"`,
      );
    }
  }
}
