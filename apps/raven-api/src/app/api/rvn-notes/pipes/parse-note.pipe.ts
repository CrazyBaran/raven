import { PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemplateEntity } from '../../rvn-templates/entities/template.entity';
import { NoteEntity } from '../entities/note.entity';

export class ParseNotePipe
  implements PipeTransform<string, Promise<NoteEntity>>
{
  @InjectRepository(NoteEntity)
  protected noteRepository: Repository<NoteEntity>;
  @InjectRepository(TemplateEntity)
  protected templateRepository: Repository<TemplateEntity>;

  public async transform(id: string): Promise<NoteEntity> {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: [
        'createdBy',
        'updatedBy',
        'deletedBy',
        'tags',
        'complexTags',
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

    // handling template separately as typeorm nested relations is pain
    const template = await this.templateRepository.findOne({
      where: { id: note.templateId },
    });
    if (template) {
      note.template = template;
    }
    return note;
  }
}
