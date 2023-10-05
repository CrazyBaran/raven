import { IsIn, IsNumber, IsOptional, IsString, Length } from 'class-validator';

import { FieldDefinitionType } from '@app/rvns-templates';
import { ApiProperty } from '@nestjs/swagger';

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
