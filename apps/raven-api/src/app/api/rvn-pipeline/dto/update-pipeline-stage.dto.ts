import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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
}
