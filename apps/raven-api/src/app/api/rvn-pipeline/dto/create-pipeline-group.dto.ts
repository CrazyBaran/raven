import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { PipelineGroupDto } from './pipeline-group.dto';

export class CreatePipelineGroupDto {
  @ApiProperty({ type: [PipelineGroupDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PipelineGroupDto)
  public readonly groups: PipelineGroupDto[];
}
