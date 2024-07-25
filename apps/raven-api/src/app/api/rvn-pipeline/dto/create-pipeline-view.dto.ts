import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PipelineViewColumnDto } from './pipeline-view-column.dto';

export class CreatePipelineViewDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  public readonly name: string;

  @ApiProperty()
  @IsPositive()
  @IsDefined()
  public readonly order: number;

  @ApiProperty({ type: [PipelineViewColumnDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PipelineViewColumnDto)
  public readonly columns: PipelineViewColumnDto[];
}
