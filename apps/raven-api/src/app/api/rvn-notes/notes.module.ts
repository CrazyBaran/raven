import { Module, ParseUUIDPipe } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParseTemplateWithGroupsAndFieldsPipe } from '../../shared/pipes/parse-template-with-groups-and-fields.pipe';
import { NoteFieldGroupEntity } from './entities/note-field-group.entity';
import { NoteFieldEntity } from './entities/note-field.entity';
import { NoteEntity } from './entities/note.entity';
import { NoteAssignedToOpportunityEventHandler } from './event-handlers/note-assigned-to-opportunity.event-handler';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NoteEntity,
      NoteFieldGroupEntity,
      NoteFieldEntity,
      EventEmitterModule,
    ]),
  ],
  controllers: [NotesController],
  providers: [
    NotesService,
    ParseUUIDPipe,
    ParseTemplateWithGroupsAndFieldsPipe,
    NoteAssignedToOpportunityEventHandler,
  ],
})
export class NotesModule {}
