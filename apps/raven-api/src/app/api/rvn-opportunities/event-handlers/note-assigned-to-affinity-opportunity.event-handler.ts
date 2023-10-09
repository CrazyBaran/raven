import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { NoteAssignedToOpportunityEvent } from '../../rvn-notes/events/note-assigned-to-opportunity.event';
import { NoteAssignedToAffinityOpportunityEvent } from '../events/note-assigned-to-affinity-opportunity.event';
import { OpportunityService } from '../opportunity.service';
import { OrganisationService } from '../organisation.service';

@Injectable()
export class NoteAssignedToAffinityOpportunityEventHandler {
  public constructor(
    private readonly opportunityService: OpportunityService,
    private readonly organisationService: OrganisationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(`note.assigned.affinity-opportunity`)
  protected async process(
    event: NoteAssignedToAffinityOpportunityEvent,
  ): Promise<void> {
    const organisation = await this.organisationService.createFromAffinityOrGet(
      event.opportunityAffinityInternalId,
    );
    const opportunity = await this.opportunityService.createFromAffinity(
      organisation.id,
      event.opportunityAffinityInternalId,
    );

    this.eventEmitter.emit(
      `note.assigned.opportunity`,
      new NoteAssignedToOpportunityEvent(
        event.noteEntity,
        opportunity.id,
        event.assignedBy,
      ),
    );
  }
}
