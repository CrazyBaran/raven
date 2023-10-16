import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateTabDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  public readonly name?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public readonly order?: number;
}
