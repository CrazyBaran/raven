import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsHexColor, IsNumber, IsUUID } from 'class-validator';

export class PipelineStageConfigurationDto {
  @ApiProperty()
  @IsDefined()
  @IsHexColor()
  public readonly color: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  public readonly order: number;

  @ApiProperty()
  @IsDefined()
  @IsUUID(undefined, { each: true })
  public readonly droppableFrom: string[];
}
