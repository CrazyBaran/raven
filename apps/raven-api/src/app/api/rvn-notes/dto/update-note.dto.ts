import { WorkflowNoteData } from '@app/rvns-notes/data-access';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ComplexTagDto } from './complex-tag.dto';
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

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComplexTagDto)
  public readonly companyOpportunityTags?: ComplexTagDto[];

  @ApiProperty()
  @IsOptional()
  @IsObject()
  public readonly origin: WorkflowNoteData;
}
