import { OpportunityStageChangedEvent } from '@app/rvns-opportunities';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CompanyStatus } from 'rvns-shared';
import { ShortlistsService } from '../shortlists.service';

@Injectable()
export class OpportunityStageChangedEventHandler {
  public constructor(private readonly shortlistsService: ShortlistsService) {}

  @OnEvent('opportunity-stage-changed')
  protected async process(event: OpportunityStageChangedEvent): Promise<void> {
    if (
      event.relatedCompanyStatus === CompanyStatus.OUTREACH &&
      event.userId &&
      event.organisationId
    ) {
      this.shortlistsService.addOrganisationToPersonalList(
        event.userId,
        event.organisationId,
      );
    }
  }
}
