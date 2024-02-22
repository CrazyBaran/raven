import { UserRegisteredEvent } from '@app/rvns-auth';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ShortlistsService } from '../../rvn-shortlists/shortlists.service';

@Injectable()
export class UserRegisteredEventHandler {
  public constructor(private readonly shortlistsService: ShortlistsService) {}

  @OnEvent('user-registered')
  protected async process(event: UserRegisteredEvent): Promise<void> {
    if (
      !(await this.shortlistsService.getUserPersonalShortlist(event.userId))
    ) {
      await this.shortlistsService.createPersonalShortlistForUser(
        event.userId,
        event.name,
      );
    }
  }
}
