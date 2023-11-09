import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateTabDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  public readonly name?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public readonly order?: number;

  @ApiProperty()
  @IsOptional()
  @IsUUID(undefined, { each: true })
  public readonly fieldIds?: string[];

  @ApiProperty()
  @IsOptional()
  @IsUUID(undefined, { each: true })
  public readonly pipelineStageIds?: string[];
}
