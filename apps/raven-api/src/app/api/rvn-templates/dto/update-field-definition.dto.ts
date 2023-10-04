import {
  IsDefined,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { FieldDefinitionType } from '../enums/field-definition-type.enum';

export class UpdateFieldDefinitionDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  public readonly name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsIn(Object.values(FieldDefinitionType))
  public readonly type?: FieldDefinitionType;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public readonly order?: number;
}
