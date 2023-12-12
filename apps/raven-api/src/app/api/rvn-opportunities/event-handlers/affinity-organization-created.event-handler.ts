import { AffinityOrganizationCreatedEvent } from '@app/rvns-affinity-integration';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AffinityCacheService } from '../../rvn-affinity-integration/cache/affinity-cache.service';
import { OrganisationService } from '../organisation.service';

@Injectable()
export class AffinityOrganisationCreatedEventHandler {
  public constructor(
    private readonly organisationService: OrganisationService,
    private readonly affinityCacheService: AffinityCacheService,
  ) {}

  @OnEvent('affinity-organization-created')
  protected async createOpportunity(
    event: AffinityOrganizationCreatedEvent,
  ): Promise<void> {
    if (!event.domains || event.domains.length === 0) return;

    const organisationEntity =
      await this.organisationService.getExistingByDomains(event.domains);
    if (organisationEntity) {
      if (!event.createOpportunity) {
        return;
      }
      const organizationStageDtos =
        await this.affinityCacheService.getByDomains(event.domains);

      await this.organisationService.createOpportunityForOrganisation(
        organisationEntity,
        organizationStageDtos[0].stage?.text || null,
      );
      return;
    }

    await this.organisationService.create({
      name: event.name,
      domain: event.domains[0],
      createOpportunity: event.createOpportunity,
    });
  }
}
