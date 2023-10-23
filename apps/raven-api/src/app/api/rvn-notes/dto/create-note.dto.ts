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
import { FieldUpdateDto } from './field-update.dto';

export class CreateNoteDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly name: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID(undefined, { each: true })
  public readonly tagIds?: string[];

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  public readonly templateId?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldUpdateDto)
  public readonly fields?: FieldUpdateDto[];
}
