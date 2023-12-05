import { EntityManager, FindOptionsWhere, In } from 'typeorm';

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
  implements PipeTransform<string | string[], Promise<E | E[]>>
{
  /**
   * Resource name in singular form used in exception messages.
   */
  @Inject(EntityManager)
  protected entityManager: EntityManager;
  protected optional = false;
  protected readonly entityField: string = 'id';
  protected readonly relations: string[] = [];
  protected abstract entityClass: EntityTarget<E>;
  protected abstract resource: string;

  public async transform(
    id: string | string[],
    metadata: ArgumentMetadata,
  ): Promise<E | E[]> {
    if (id && typeof id === 'string') {
      const entity = await this.entityManager.findOne(this.entityClass, {
        where: {
          [this.entityField]: id,
        } as FindOptionsWhere<E>,
        relations: this.relations,
      });
      if (entity) {
        return entity;
      }
      if (this.optional) {
        return null;
      }
      throw new NotFoundException(
        `Unable to find "${this.resource}" with id: "${id}"`,
      );
    }
    if (id && Array.isArray(id)) {
      const entities = await this.entityManager.find(this.entityClass, {
        where: {
          [this.entityField]: In(id),
        } as FindOptionsWhere<E>,
        relations: this.relations,
      });
      if (entities.length !== id.length) {
        const missingIds = id.filter(
          (id) => !entities.some((entity) => entity[this.entityField] === id),
        );
        if (this.optional) {
          return null;
        }
        throw new NotFoundException(
          `Unable to find "${this.resource}" with ids: "${missingIds.join(
            ', ',
          )}"`,
        );
      }
      return entities;
    }
    if (this.optional) {
      return null;
    }
    throw new NotFoundException(
      `"${metadata.data}" should not be null or undefined`,
    );
  }
}
