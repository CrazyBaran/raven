import { Module, ParseUUIDPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParseTemplateWithGroupsAndFieldsPipe } from '../../shared/pipes/parse-template-with-groups-and-fields.pipe';
import { NoteFieldGroupEntity } from './entities/note-field-group.entity';
import { NoteFieldEntity } from './entities/note-field.entity';
import { NoteEntity } from './entities/note.entity';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NoteEntity,
      NoteFieldGroupEntity,
      NoteFieldEntity,
    ]),
  ],
  controllers: [NotesController],
  providers: [
    NotesService,
    ParseUUIDPipe,
    ParseTemplateWithGroupsAndFieldsPipe,
  ],
})
export class NotesModule {}
