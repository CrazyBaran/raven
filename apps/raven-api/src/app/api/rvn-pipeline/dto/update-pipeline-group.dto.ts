import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdatePipelineGroupDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly name: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @IsUUID(undefined, { each: true })
  public readonly stageIds: string[];
}
