import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsString, Min } from 'class-validator';

export class PipelineStageDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  public displayName: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public mappedFrom: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  @Min(1)
  public order: number;
}
