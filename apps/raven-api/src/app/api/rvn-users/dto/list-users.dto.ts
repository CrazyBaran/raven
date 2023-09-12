import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListUsersDto {
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  public readonly search?: string;
}
