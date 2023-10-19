import { IsIn, IsOptional, IsString, Length } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SortOptions } from '../enum/sort-options.enum';

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
