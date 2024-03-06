import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsDate,
  IsDefined,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateReminderDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @MaxLength(256)
  public readonly name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  public readonly description: string;

  @ApiProperty()
  @IsDefined()
  @IsDate()
  public readonly dueDate: Date;

  @ApiProperty()
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  public readonly assignees: string[];

  @ApiProperty()
  @IsOptional()
  public readonly tag: {
    companyId: string;
    opportunityId?: string;
  };
}
