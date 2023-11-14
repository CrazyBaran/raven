import { OpportunityCreatedEvent } from '@app/rvns-opportunities';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { OpportunityEntity } from '../../rvn-opportunities/entities/opportunity.entity';
import { NotesService } from '../notes.service';

@Injectable()
export class OpportunityCreatedEventHandler {
  public constructor(
    private readonly noteService: NotesService,
    @InjectRepository(OpportunityEntity)
    private readonly opportunityRepository: Repository<OpportunityEntity>,
  ) {}

  @OnEvent('opportunity-created')
  protected async createOpportunity(
    event: OpportunityCreatedEvent,
  ): Promise<void> {
    const rootVersionId = uuidv4();
    const note = await this.noteService.createNote({
      name: 'Default workflow note',
      userEntity: event.createdBy,
      templateEntity: event.workflowTemplate,
      rootVersionId,
      tags: [],
      fields: [],
    });
    event.opportunityEntity.note = note;
    event.opportunityEntity.noteId = note.id;
    await this.opportunityRepository.save(event.opportunityEntity);
  }
}
