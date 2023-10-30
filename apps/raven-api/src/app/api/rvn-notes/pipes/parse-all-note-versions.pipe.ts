import { ILike, Repository } from 'typeorm';

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
    });

    if (!note) {
      throw new Error(`Note with id ${id} not found`);
    }

    return await this.noteRepository.find({
      where: { rootVersionId: ILike(note.rootVersionId.toLowerCase()) }, // TODO remove all notes so all have consistent casing after this PR is merged, then remove this ILike part...
      relations: [
        'createdBy',
        'updatedBy',
        'deletedBy',
        'tags',
        'complexTags',
        'template',
        'noteTabs',
        'noteTabs.noteFieldGroups',
        'noteTabs.noteFieldGroups.noteFields',
        'noteFieldGroups',
        'noteFieldGroups.noteFields',
      ],
    });
  }
}
