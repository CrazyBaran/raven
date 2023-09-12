import { EntityManager, FindOptionsWhere } from 'typeorm';

import {
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common/interfaces/features/pipe-transform.interface';
import { EntityTarget } from 'typeorm/common/EntityTarget';

@Injectable()
export abstract class AbstractEntityPipe<E>
  implements PipeTransform<string, Promise<E>>
{
  /**
   * Resource name in singular form used in exception messages.
   */
  @Inject(EntityManager)
  protected entityManager: EntityManager;
  protected readonly entityField: string = 'id';
  protected readonly relations: string[] = [];
  protected abstract entityClass: EntityTarget<E>;
  protected abstract resource: string;

  public async transform(id: string, metadata: ArgumentMetadata): Promise<E> {
    if (id) {
      const entity = await this.entityManager.findOne(this.entityClass, {
        where: {
          [this.entityField]: id,
        } as FindOptionsWhere<E>,
        relations: this.relations,
      });
      if (entity) {
        return entity;
      }
      throw new NotFoundException(
        `Unable to find "${this.resource}" with id: "${id}"`
      );
    }
    throw new NotFoundException(
      `"${metadata.data}" should not be null or undefined`
    );
  }
}
