import { Repository } from 'typeorm';

import { TemplateTypeEnum } from '@app/rvns-templates';
import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TemplateEntity } from '../../rvn-templates/entities/template.entity';

@Injectable()
export class ParseWorkflowTemplatePipe
  implements PipeTransform<string, Promise<TemplateEntity>>
{
  @InjectRepository(TemplateEntity)
  protected readonly templateEntityRepository: Repository<TemplateEntity>;

  public async transform(id: string): Promise<TemplateEntity> {
    const templateEntity = await this.templateEntityRepository.findOne({
      where: {
        id,
        type: TemplateTypeEnum.Workflow,
      },
      relations: [],
    });
    if (templateEntity) {
      return templateEntity;
    }
    throw new NotFoundException(
      `Unable to find workflow template with id: "${id}"`,
    );
  }
}
