import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateTabDto {
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
  @IsUUID(undefined, { each: true })
  public readonly relatedFieldIds?: string[];

  @ApiProperty()
  @IsOptional()
  @IsUUID(undefined, { each: true })
  public readonly relatedTemplateIds?: string[];

  @ApiProperty()
  @IsOptional()
  @IsUUID(undefined, { each: true })
  public readonly pipelineStageIds?: string[];
}
