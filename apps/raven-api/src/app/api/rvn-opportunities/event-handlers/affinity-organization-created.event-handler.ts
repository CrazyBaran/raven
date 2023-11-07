import { AffinityOrganizationCreatedEvent } from '@app/rvns-affinity-integration';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrganisationService } from '../organisation.service';

@Injectable()
export class AffinityOrganisationCreatedEventHandler {
  public constructor(
    private readonly organisationService: OrganisationService,
  ) {}

  @OnEvent('affinity-organization-created')
  protected async createOpportunity(
    event: AffinityOrganizationCreatedEvent,
  ): Promise<void> {
    if (!event.domains || event.domains.length === 0) return;

    if (await this.organisationService.exists(event.domains)) {
      return;
    }

    await this.organisationService.create({
      name: event.name,
      domain: event.domains[0],
    });
  }
}
