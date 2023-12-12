import {
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { FieldDefinitionType } from '@app/rvns-templates';
import { ApiProperty } from '@nestjs/swagger';
import { HeatmapFieldConfigurationDto } from './field-configs/heatmap-field-configuration.dto';

export class UpdateFieldDefinitionDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  public readonly name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsIn(Object.values(FieldDefinitionType))
  public readonly type?: FieldDefinitionType;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public readonly order?: number;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @ValidateIf((value) => value.configuration)
  public readonly configuration?: HeatmapFieldConfigurationDto | null;
}
