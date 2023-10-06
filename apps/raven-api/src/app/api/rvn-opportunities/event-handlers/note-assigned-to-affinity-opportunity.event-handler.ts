import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { NoteAssignedToAffinityOpportunityEvent } from '../events/note-assigned-to-affinity-opportunity.event';
import { NoteAssignedToOpportunityEvent } from '../events/note-assigned-to-opportunity.event';
import { OpportunityService } from '../opportunity.service';

@Injectable()
export class NoteAssignedToAffinityOpportunityEventHandler {
  public constructor(
    private readonly opportunityService: OpportunityService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(`note.assigned.affinity-opportunity`)
  protected async process(
    event: NoteAssignedToAffinityOpportunityEvent,
  ): Promise<void> {
    const opportunity = await this.opportunityService.createFromAffinity(
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
