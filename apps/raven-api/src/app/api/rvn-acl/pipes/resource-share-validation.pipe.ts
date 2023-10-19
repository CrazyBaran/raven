import * as _ from 'lodash';
import { ObjectLiteral } from 'typeorm';

import { ForbiddenException, Injectable, PipeTransform } from '@nestjs/common';
import { ShareResourceCode } from '../enums/share-resource-code.enum';
import { resourceConfig } from '../permissions/resource.config';
import { ShareValidationPipe } from './share-validation.pipe';

@Injectable()
export class ResourceShareValidationPipe<
    T extends ObjectLiteral = ObjectLiteral,
  >
  extends ShareValidationPipe
  implements PipeTransform<T | T[], Promise<T | T[]>>
{
  public async transform(input: T | T[]): Promise<T | T[]> {
    const entities = Array.isArray(input) ? input : [input];

    for (const entity of entities) {
      const resId = this.getResId(entity);
      const resType = this.getResCode(entity);

      if (typeof resId === 'undefined' || typeof resType === 'undefined') {
        throw new ForbiddenException('Unknown resource');
      }

      await this.validate(`${resType}-${resId}`);
    }

    return Array.isArray(input) ? entities : entities[0];
  }

  protected getResId(entity: T): number {
    if (!resourceConfig[entity.constructor.name]) {
      throw new ForbiddenException(
        'Given resource is missing in the mapping, please update config',
      );
    }
    return _.get(entity, resourceConfig[entity.constructor.name].idPath);
  }

  protected getResCode(entity: T): ShareResourceCode {
    return resourceConfig[entity.constructor.name].shareCode;
  }
}
