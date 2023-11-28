import { PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemplateEntity } from '../../rvn-templates/entities/template.entity';
import { NoteEntity } from '../entities/note.entity';

export class ParseNoteForUpdatePipe
  implements PipeTransform<string, Promise<NoteEntity>>
{
  @InjectRepository(NoteEntity)
  protected noteRepository: Repository<NoteEntity>;
  @InjectRepository(TemplateEntity)
  protected templateRepository: Repository<TemplateEntity>;

  public async transform(id: string): Promise<NoteEntity> {
    const start = Date.now();
    const qb = this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.createdBy', 'createdBy')
      .leftJoinAndSelect('note.updatedBy', 'updatedBy')
      .leftJoinAndSelect('note.tags', 'tags')
      .leftJoinAndSelect('note.complexTags', 'complexTags')
      .leftJoinAndSelect('note.noteTabs', 'noteTabs')
      .leftJoinAndSelect('noteTabs.noteFieldGroups', 'noteFieldGroups')
      .leftJoinAndSelect('noteFieldGroups.noteFields', 'noteFields')
      .leftJoinAndSelect('note.noteFieldGroups', 'noteFieldGroupsDirect')
      .leftJoinAndSelect('noteFieldGroupsDirect.noteFields', 'noteFieldsDirect')
      .leftJoin('note.template', 'template')
      .addSelect(['template.type', 'template.name', 'template.id'])
      .where('note.id = :id', { id });

    const note = await qb.getOne();

    // TODO remove debug
    console.log(`NoteRepository.getOne took ${Date.now() - start}ms`);

    if (!note) {
      throw new Error(`Note with id ${id} not found`);
    }
    return note;
  }
}
