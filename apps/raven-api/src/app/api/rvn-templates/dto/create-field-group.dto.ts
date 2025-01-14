import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateFieldGroupDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @Length(1, 50)
  public readonly name: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  public readonly order: number;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  public readonly tabId?: string;
}
