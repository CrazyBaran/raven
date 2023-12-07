import { OpportunityCreatedEvent } from '@app/rvns-opportunities';
import { TemplateTypeEnum } from '@app/rvns-templates';
import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EntityManager } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { OpportunityEntity } from '../../rvn-opportunities/entities/opportunity.entity';
import { TemplateEntity } from '../../rvn-templates/entities/template.entity';
import { UserEntity } from '../../rvn-users/entities/user.entity';
import { NotesService } from '../notes.service';

@Injectable()
export class OpportunityCreatedNoteEventHandler {
  public constructor(
    private readonly noteService: NotesService,
    private readonly entityManager: EntityManager,
    private readonly logger: RavenLogger,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.logger.setContext(OpportunityCreatedNoteEventHandler.name);
  }

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

    const templateSearchOptions = {
      type: TemplateTypeEnum.Workflow,
      ...(event.workflowTemplateId
        ? { id: event.workflowTemplateId }
        : { isDefault: true }),
    };

    const workflowTemplate = await this.entityManager.findOne(TemplateEntity, {
      where: templateSearchOptions,
    });

    const note = await this.noteService.createNote({
      name: 'Default workflow note',
      userEntity: userEntity,
      templateEntity: workflowTemplate,
      rootVersionId,
      tags: [],
      fields: [],
    });
    opportunityEntity.noteId = note.id;

    const savedOpportunity = await this.entityManager.save(
      OpportunityEntity,
      opportunityEntity,
    );
    this.logger.info(
      `Saved opportunity ${savedOpportunity.id} with note ${savedOpportunity.noteId}`,
    );
    this.logger.debug({ savedOpportunity });
    // we need to emit this event to trigger the creation of the sharepoint directories
    this.eventEmitter.emit('opportunity-note-created', event);
  }
}
