import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrganisationCreatedEvent } from '../events/organisation-created.event';
import { OpportunityService } from '../opportunity.service';

@Injectable()
export class OrganisationCreatedEventHandler {
  public constructor(private readonly opportunityService: OpportunityService) {}

  @OnEvent('organisation-created')
  protected async createOpportunity(
    event: OrganisationCreatedEvent,
  ): Promise<void> {
    await this.opportunityService.createFromOrganisation({
      organisation: event.organisationEntity,
    });
  }
}
