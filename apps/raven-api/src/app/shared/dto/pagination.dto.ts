import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public readonly skip?: number = 0;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  public readonly take?: number = 10;
}
