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
import { NoteFieldGroupEntity } from './entities/note-field-group.entity';
import { NoteFieldEntity } from './entities/note-field.entity';
import { NoteTabEntity } from './entities/note-tab.entity';
import { NoteEntity } from './entities/note.entity';
import { NotesServiceLogger } from './notes-service.logger';
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
    ]),
    EventEmitterModule,
    StorageAccountModule,
  ],
  controllers: [NotesController],
  providers: [
    NotesService,
    NotesServiceLogger,
    ParseUUIDPipe,
    ParseTemplateWithGroupsAndFieldsPipe,
  ],
})
export class NotesModule {}
