import { TagTypeEnum } from '@app/rvns-tags';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrganisationCreatedEvent } from '../../rvn-opportunities/events/organisation-created.event';
import { TagsService } from '../tags.service';

@Injectable()
export class OrganisationCreatedEventHandler {
  public constructor(private readonly tagService: TagsService) {}

  @OnEvent('organisation-created')
  protected async createOrganisationTag(
    event: OrganisationCreatedEvent,
  ): Promise<void> {
    console.log({ event });
    await this.tagService.createTag({
      name: event.organisationEntity.name,
      type: TagTypeEnum.Company,
      organisationId: event.organisationEntity.id,
    });
  }
}
