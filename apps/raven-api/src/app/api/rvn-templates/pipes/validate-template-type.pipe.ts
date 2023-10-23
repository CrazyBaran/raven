import { TemplateTypeEnum } from '@app/rvns-templates';
import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateTemplateTypePipe
  implements PipeTransform<string | null, TemplateTypeEnum | null>
{
  public transform(value: string | null): TemplateTypeEnum | null {
    if (!value) {
      return null;
    }
    if (!Object.values(TemplateTypeEnum).includes(value as TemplateTypeEnum)) {
      throw new Error(`Template type ${value} is not valid`);
    }
    return value as TemplateTypeEnum;
  }
}
