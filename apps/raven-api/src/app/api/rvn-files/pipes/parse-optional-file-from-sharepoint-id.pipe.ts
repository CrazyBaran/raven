import { Inject, PipeTransform } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { FileEntity } from '../entities/file.entity';

export class ParseOptionalFileFromSharepointIdPipe
  implements PipeTransform<string, Promise<FileEntity | null>>
{
  @Inject(EntityManager)
  protected entityManager: EntityManager;
  public async transform(id: string): Promise<FileEntity | null> {
    const entity = await this.entityManager.findOne(FileEntity, {
      where: {
        internalSharepointId: id,
      },
      relations: ['tags'],
    });
    if (entity) {
      return entity;
    }
    return null;
  }
}
