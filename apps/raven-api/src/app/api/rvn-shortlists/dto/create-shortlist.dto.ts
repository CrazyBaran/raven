import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateShortlistDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @MaxLength(256)
  public readonly name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  public readonly description?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID(undefined, { each: true })
  public readonly organisations?: string[];
}
