import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class PipelineViewColumnDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  public readonly name: string;

  @ApiProperty()
  @IsArray()
  @IsUUID(undefined, { each: true })
  public readonly stageIds: string[];

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public readonly flat: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly color: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly backgroundColor: string;
}
