import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NoteAssignedToOpportunityEvent } from '../events/note-assigned-to-opportunity.event';
import { NotesService } from '../notes.service';

@Injectable()
export class NoteAssignedToOpportunityEventHandler {
  public constructor(private readonly notesService: NotesService) {}

  @OnEvent(`note.assigned.opportunity`)
  protected async process(
    event: NoteAssignedToOpportunityEvent,
  ): Promise<void> {
    await this.notesService.updateNote(event.noteEntity, event.assignedBy, {
      opportunityId: event.opportunityId,
    });
  }
}
