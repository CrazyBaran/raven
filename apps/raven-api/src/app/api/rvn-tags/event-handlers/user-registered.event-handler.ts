import { UserRegisteredEvent } from '@app/rvns-auth';
import { TagTypeEnum } from '@app/rvns-tags';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TagsService } from '../tags.service';

@Injectable()
export class UserRegisteredEventHandler {
  public constructor(private readonly tagService: TagsService) {}

  @OnEvent('user-registered')
  protected async process(event: UserRegisteredEvent): Promise<void> {
    await this.tagService.createTag({
      name: event.name,
      type: TagTypeEnum.People,
      userId: event.userId,
    });
  }
}
