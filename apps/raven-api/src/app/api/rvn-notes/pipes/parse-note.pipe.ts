import { Repository } from 'typeorm';

import { Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteEntity } from '../entities/note.entity';

@Injectable()
export class ParseNotePipe
  implements PipeTransform<string, Promise<NoteEntity>>
{
  @InjectRepository(NoteEntity)
  protected noteRepository: Repository<NoteEntity>;

  public async transform(id: string): Promise<NoteEntity> {
    const result = await this.noteRepository.findOne({
      where: { id },
      relations: [
        'createdBy',
        'updatedBy',
        'deletedBy',
        'tags',
        'template',
        'noteTabs',
        'noteTabs.noteFieldGroups',
        'noteTabs.noteFieldGroups.noteFields',
        'noteFieldGroups',
        'noteFieldGroups.noteFields',
      ],
    });
    if (!result) {
      throw new Error(`Note with id ${id} not found`);
    }
    return result;
  }
}
