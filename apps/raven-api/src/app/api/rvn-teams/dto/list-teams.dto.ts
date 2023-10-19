import { IsIn, IsOptional, IsString } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../shared/dto/pagination.dto';
import { SortOptions } from '../../../shared/enum/sort-options.enum';
import { SortableColumns, SortableColumnsType } from '../teams.service';

export class ListTeamsDto extends PaginationDto {
  @ApiProperty({ enum: SortOptions })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsIn(Object.values(SortOptions))
  public readonly sortDir?: SortOptions;

  @ApiProperty({ enum: SortableColumns })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsIn(Object.values(SortableColumns))
  public readonly sort?: SortableColumnsType;
}
