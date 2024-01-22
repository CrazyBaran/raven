import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNumber, IsUUID } from 'class-validator';

enum ConfigColour {
  WARNING = 'warning',
  SUCCESS = 'success',
}

export class PipelineStageConfigurationDto {
  @ApiProperty()
  @IsDefined()
  @IsEnum(ConfigColour)
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
