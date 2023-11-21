import {
  Inject,
  Injectable,
  ParseUUIDPipe,
  PipeTransform,
} from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common/interfaces/features/pipe-transform.interface';
import { TemplateEntity } from '../../api/rvn-templates/entities/template.entity';
import { ParseTemplateWithGroupsAndFieldsPipe } from './parse-template-with-groups-and-fields.pipe';

@Injectable()
export class ParseOptionalTemplateWithGroupsAndFieldsPipe
  implements PipeTransform<string, Promise<TemplateEntity | null>>
{
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
