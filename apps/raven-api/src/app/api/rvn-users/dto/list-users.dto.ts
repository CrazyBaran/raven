import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListUsersDto {
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  public readonly search?: string;
}
