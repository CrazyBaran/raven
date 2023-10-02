import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateFieldDefinitionDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  public readonly name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  public readonly type?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public readonly order?: number;
}
