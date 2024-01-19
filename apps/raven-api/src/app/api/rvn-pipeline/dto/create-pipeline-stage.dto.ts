import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PipelineStageConfigurationDto } from './pipeline-stage-configuration.dto';

export class CreatePipelineStageDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  public readonly displayName: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  public readonly order: number;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly mappedFrom: string;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  public readonly configuration?: PipelineStageConfigurationDto | null;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  public readonly showFields?: string[];
}
