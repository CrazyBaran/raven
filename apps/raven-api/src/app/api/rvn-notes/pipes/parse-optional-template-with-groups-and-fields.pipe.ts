import { EntityManager } from 'typeorm';

import {
  Inject,
  Injectable,
  ParseUUIDPipe,
  PipeTransform,
} from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common/interfaces/features/pipe-transform.interface';
import { ParseTemplateWithGroupsAndFieldsPipe } from '../../../shared/pipes/parse-template-with-groups-and-fields.pipe';
import { TemplateEntity } from '../../rvn-templates/entities/template.entity';

@Injectable()
export class ParseOptionalTemplateWithGroupsAndFieldsPipe
  implements PipeTransform<string, Promise<TemplateEntity | null>>
{
  @Inject(EntityManager)
  protected entityManager: EntityManager;

  @Inject(ParseUUIDPipe)
  protected parseUUIDPipe: ParseUUIDPipe;

  @Inject(ParseTemplateWithGroupsAndFieldsPipe)
  protected templatePipe: ParseTemplateWithGroupsAndFieldsPipe;

  public async transform(
    value: string | null,
    metadata: ArgumentMetadata,
  ): Promise<TemplateEntity | null> {
    if (!value) {
      return null;
    }

    const uuidValue = await this.parseUUIDPipe.transform(value, metadata);

    return this.templatePipe.transform(uuidValue);
  }
}
