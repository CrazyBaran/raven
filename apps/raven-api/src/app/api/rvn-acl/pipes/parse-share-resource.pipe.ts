import { EntityManager } from 'typeorm';

import { AclService } from '../acl.service';
import { ShareResource } from '../contracts/share-resource.interface';
import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common/interfaces/features/pipe-transform.interface';

@Injectable()
export class ParseShareResourcePipe
  implements PipeTransform<string, Promise<ShareResource>>
{
  public constructor(
    private readonly entityManager: EntityManager,
    private readonly aclService: AclService,
  ) {}

  public async transform(
    resourceId: string,
    metadata: ArgumentMetadata,
  ): Promise<ShareResource> {
    if (resourceId) {
      const parsedId = this.aclService.parseCompoundId(resourceId);
      const resource = await this.entityManager.findOne(
        parsedId.shareResourceEntityClass,
        {
          where: { id: parsedId.id },
        },
      );
      if (resource) {
        return resource;
      }
      throw new NotFoundException(
        `Unable to find "resource" with id: "${resourceId}"`,
      );
    }
    throw new NotFoundException(
      `"${metadata.data}" should not be null or undefined`,
    );
  }
}
