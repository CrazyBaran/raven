import { Module, ParseUUIDPipe } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParseTemplateWithGroupsAndFieldsPipe } from '../../shared/pipes/parse-template-with-groups-and-fields.pipe';
import { OpportunityEntity } from '../rvn-opportunities/entities/opportunity.entity';
import { OrganisationEntity } from '../rvn-opportunities/entities/organisation.entity';
import { StorageAccountModule } from '../rvn-storage-account/storage-account.module';
import {
  OrganisationTagEntity,
  TagEntity,
} from '../rvn-tags/entities/tag.entity';
import { TemplateEntity } from '../rvn-templates/entities/template.entity';
import { NoteFieldGroupEntity } from './entities/note-field-group.entity';
import { NoteFieldEntity } from './entities/note-field.entity';
import { NoteTabEntity } from './entities/note-tab.entity';
import { NoteEntity } from './entities/note.entity';
import { OpportunityCreatedEventHandler } from './event-handlers/opportunity-created.event-handler';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NoteEntity,
      NoteTabEntity,
      NoteFieldGroupEntity,
      NoteFieldEntity,
      TagEntity,
      OrganisationTagEntity,
      OpportunityEntity,
      OrganisationEntity,
      TemplateEntity,
    ]),
    EventEmitterModule,
    StorageAccountModule,
  ],
  controllers: [NotesController],
  providers: [
    NotesService,
    ParseUUIDPipe,
    ParseTemplateWithGroupsAndFieldsPipe,
    OpportunityCreatedEventHandler,
  ],
})
export class NotesModule {}
