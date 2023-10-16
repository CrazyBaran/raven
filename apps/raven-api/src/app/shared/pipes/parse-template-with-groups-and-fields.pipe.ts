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
    // const templateEntity = await this.entityManager.findOne(TemplateEntity, {
    //   where: { id },
    //   relations: [
    //     'tabs',
    //     'tabs.fieldGroups',
    //     'tabs.fieldGroups.fieldDefinitions',
    //     'fieldGroups',
    //     'fieldGroups.fieldDefinitions',
    //   ],
    // });

    const templateEntity = this.entityManager
      .createQueryBuilder(TemplateEntity, 'templateEntity')
      .leftJoinAndSelect('templateEntity.tabs', 'tabs')
      .leftJoinAndSelect('tabs.fieldGroups', 'tabFieldGroups')
      .leftJoinAndSelect(
        'tabFieldGroups.fieldDefinitions',
        'tabFieldDefinitions',
      )
      .leftJoinAndSelect(
        'templateEntity.fieldGroups',
        'directFieldGroups',
        'directFieldGroups.tabId IS NULL',
      )
      .leftJoinAndSelect(
        'directFieldGroups.fieldDefinitions',
        'directFieldDefinitions',
      )
      .where('templateEntity.id = :id', { id })
      .getOne();

    if (templateEntity) {
      return templateEntity;
    }

    throw new NotFoundException(`Unable to find template with id: "${id}"`);
  }
}
