import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsHexColor, IsNumber } from 'class-validator';

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
  @IsBoolean()
  public readonly droppable: boolean;
}
