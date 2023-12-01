import { PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoteEntity } from '../entities/note.entity';

export class ParseSimpleNotePipe
  implements PipeTransform<string, Promise<NoteEntity>>
{
  @InjectRepository(NoteEntity)
  protected noteRepository: Repository<NoteEntity>;

  public async transform(id: string): Promise<NoteEntity> {
    const qb = this.noteRepository
      .createQueryBuilder('note')
      .where('note.id = :id', { id })
      .andWhere('note.deletedAt IS NULL');

    const note = await qb.getOne();
    if (!note) {
      throw new Error(`Note with id ${id} not found`);
    }
    return note;
  }
}
