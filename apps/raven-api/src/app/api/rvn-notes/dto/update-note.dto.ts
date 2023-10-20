import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class FieldUpdateDto {
  @ApiProperty()
  @IsDefined()
  @IsUUID()
  public readonly id: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly value: string;
}

export class UpdateNoteDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID(undefined, { each: true })
  public readonly tagIds?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldUpdateDto)
  public readonly fields?: FieldUpdateDto[];
}
