import { OpportunityCreatedEvent } from '@app/rvns-opportunities';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EntityManager } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { OpportunityEntity } from '../../rvn-opportunities/entities/opportunity.entity';
import { TemplateEntity } from '../../rvn-templates/entities/template.entity';
import { UserEntity } from '../../rvn-users/entities/user.entity';
import { NotesService } from '../notes.service';

@Injectable()
export class OpportunityCreatedEventHandler {
  public constructor(
    private readonly noteService: NotesService,
    private readonly entityManager: EntityManager,
  ) {}

  @OnEvent('opportunity-created')
  protected async createOpportunity(
    event: OpportunityCreatedEvent,
  ): Promise<void> {
    const rootVersionId = uuidv4();
    const opportunityEntity = await this.entityManager.findOne(
      OpportunityEntity,
      {
        where: { id: event.opportunityEntityId },
      },
    );
    const userEntity = await this.entityManager.findOne(UserEntity, {
      where: { id: event.createdById },
    });
    const workflowTemplate = await this.entityManager.findOne(TemplateEntity, {
      where: { id: event.workflowTemplateId },
    });

    const note = await this.noteService.createNote({
      name: 'Default workflow note',
      userEntity: userEntity,
      templateEntity: workflowTemplate,
      rootVersionId,
      tags: [],
      fields: [],
    });
    opportunityEntity.note = note;
    opportunityEntity.noteId = note.id;
    await this.entityManager.save(opportunityEntity);
  }
}