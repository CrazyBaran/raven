import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PipelineViewColumnDto } from './pipeline-view-column.dto';

export class UpdatePipelineViewDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly name: string;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  public readonly order: number;

  @ApiProperty({ type: [PipelineViewColumnDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PipelineViewColumnDto)
  public readonly columns: PipelineViewColumnDto[];
}
