import { FieldDefinitionType } from '@app/rvns-templates';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { HeatmapFieldConfigurationDto } from './field-configs/heatmap-field-configuration.dto';

export class CreateFieldDefinitionDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @Length(1, 50)
  public readonly name: string;

  @ApiProperty({ enum: Object.values(FieldDefinitionType) })
  @IsDefined()
  @IsString()
  @IsIn(Object.values(FieldDefinitionType))
  public readonly type: FieldDefinitionType;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  public readonly order: number;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @ValidateIf((value) => value.type === FieldDefinitionType.Heatmap)
  public readonly configuration?: HeatmapFieldConfigurationDto | null;

  @ApiProperty()
  @IsOptional()
  @IsUUID(undefined, { each: true })
  public readonly hideOnPipelineStageIds?: string[];
}
