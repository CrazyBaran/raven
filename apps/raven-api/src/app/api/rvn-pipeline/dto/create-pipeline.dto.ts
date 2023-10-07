import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { PipelineStageDto } from './pipeline-stage.dto';

export class CreatePipelineDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PipelineStageDto)
  public readonly stages: PipelineStageDto[];
}
