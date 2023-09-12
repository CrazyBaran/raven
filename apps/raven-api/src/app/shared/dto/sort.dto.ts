import { IsIn, IsOptional, IsString, Length } from 'class-validator';

import { SortOptions } from '../enum/sort-options.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SortDto {
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsIn(Object.values(SortOptions))
  public readonly sortDir?: SortOptions;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(3, 20)
  public readonly sort?: string;
}
