import { Repository } from 'typeorm';

import { Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteEntity } from '../entities/note.entity';

@Injectable()
export class ParseAllNoteVersionsPipe
  implements PipeTransform<string, Promise<NoteEntity[]>>
{
  @InjectRepository(NoteEntity)
  protected noteRepository: Repository<NoteEntity>;

  public async transform(id: string): Promise<NoteEntity[]> {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: [
        'createdBy',
        'updatedBy',
        'tags',
        'noteTabs',
        'noteTabs.noteFieldGroups',
        'noteTabs.noteFieldGroups.noteFields',
        'noteFieldGroups',
        'noteFieldGroups.noteFields',
      ],
    });

    if (!note) {
      throw new Error(`Note with id ${id} not found`);
    }

    return await this.noteRepository.find({
      where: { rootVersionId: note.rootVersionId },
    });
  }
}
