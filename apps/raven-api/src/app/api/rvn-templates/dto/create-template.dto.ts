import { TemplateTypeEnum } from '@app/rvns-templates';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { UpdateTemplateDto } from './update-template.dto';

export class CreateTemplateDto extends UpdateTemplateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsIn(Object.values(TemplateTypeEnum))
  public readonly type?: string;
}
