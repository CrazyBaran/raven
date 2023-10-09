import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PipelineStageDto } from './pipeline-stage.dto';

export class CreatePipelineDto {
  @ApiProperty({ type: [PipelineStageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PipelineStageDto)
  public readonly stages: PipelineStageDto[];

  @ApiProperty()
  @IsString()
  @IsDefined()
  public readonly name: string;

  @ApiProperty()
  @IsDefined()
  @IsBoolean()
  public readonly isDefault: boolean;
}
