import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteEntity } from './entities/note.entity';
import { NoteFieldGroupEntity } from './entities/note-field-group.entity';
import { NoteFieldEntity } from './entities/note-field.entity';
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
  providers: [NotesService],
})
export class NotesModule {}
