import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class TagDto {
  @ApiProperty()
  @IsUUID()
  public companyId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  public opportunityId?: string;
}

export class UpdateReminderDto {
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
  @IsDate()
  public readonly dueDate?: Date;

  @ApiProperty()
  @IsOptional()
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  public readonly assignees?: string[];

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  public readonly tag?: TagDto;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  public readonly completed?: boolean;
}
