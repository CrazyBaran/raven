import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
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
  @IsDefined()
  @IsUUID(undefined, { each: true })
  public readonly tagIds?: string[];

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldUpdateDto)
  public readonly fields: FieldUpdateDto[];
}
