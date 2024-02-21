import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class UpdateShortlistDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(256)
  public readonly name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  public readonly description?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  public readonly organisations?: string[];
}
