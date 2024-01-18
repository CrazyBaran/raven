import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PipelineStageConfigurationDto } from './pipeline-stage-configuration.dto';

export class UpdatePipelineStageDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly displayName?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public readonly order?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly mappedFrom?: string;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  public readonly configuration?: PipelineStageConfigurationDto | null;
}
