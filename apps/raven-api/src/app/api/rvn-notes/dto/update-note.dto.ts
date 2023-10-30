import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { FieldUpdateDto } from './field-update.dto';

export class UpdateNoteDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID(undefined, { each: true })
  public readonly tagIds: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldUpdateDto)
  public readonly fields?: FieldUpdateDto[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly name?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  public readonly templateId?: string;
}
