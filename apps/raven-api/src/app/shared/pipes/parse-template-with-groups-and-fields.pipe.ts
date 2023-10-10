import { EntityManager } from 'typeorm';

import {
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { TemplateEntity } from '../../api/rvn-templates/entities/template.entity';

@Injectable()
export class ParseTemplateWithGroupsAndFieldsPipe
  implements PipeTransform<string, Promise<TemplateEntity>>
{
  @Inject(EntityManager)
  protected entityManager: EntityManager;

  public async transform(id: string): Promise<TemplateEntity> {
    const templateEntity = await this.entityManager
      .createQueryBuilder(TemplateEntity, 'template')
      .leftJoinAndSelect('template.fieldGroups', 'fieldGroups')
      .leftJoinAndSelect('fieldGroups.tab', 'tab')
      .leftJoinAndSelect('fieldGroups.fieldDefinitions', 'fieldDefinitions')
      .where('template.id = :id', { id })
      .getOne();

    if (templateEntity) {
      return templateEntity;
    }

    throw new NotFoundException(`Unable to find template with id: "${id}"`);
  }
}
