import { EntityManager } from 'typeorm';

import { AclService, ShareEntityRelation } from '../acl.service';
import { AbstractShareEntity } from '../entities/abstract-share.entity';
import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common/interfaces/features/pipe-transform.interface';

@Injectable()
export class ParseSharePipe
  implements PipeTransform<string, Promise<AbstractShareEntity>>
{
  protected readonly relations: ShareEntityRelation[] = ['resource'];

  public constructor(
    private readonly entityManager: EntityManager,
    private readonly aclService: AclService
  ) {}

  public async transform(
    shareId: string,
    metadata: ArgumentMetadata
  ): Promise<AbstractShareEntity> {
    if (shareId) {
      const parsedId = this.aclService.parseCompoundId(shareId);
      const share = await this.entityManager.findOne(
        parsedId.shareEntityClass,
        {
          where: { id: parsedId.id },
          relations: this.relations,
        }
      );
      if (share) {
        return share;
      }
      throw new NotFoundException(
        `Unable to find "share" with id: "${shareId}"`
      );
    }
    throw new NotFoundException(
      `"${metadata.data}" should not be null or undefined`
    );
  }
}
