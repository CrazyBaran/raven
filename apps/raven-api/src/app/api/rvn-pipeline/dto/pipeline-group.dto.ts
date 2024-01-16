import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDefined, IsString, IsUUID } from 'class-validator';

export class PipelineGroupDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  public readonly name: string;

  @ApiProperty()
  @IsArray()
  @IsUUID(undefined, { each: true })
  public readonly stageIds: string[];
}
