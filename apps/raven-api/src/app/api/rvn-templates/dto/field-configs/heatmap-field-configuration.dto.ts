import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsString, Length } from 'class-validator';

export class HeatmapFieldConfigurationDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @Length(1, 50)
  public readonly unit: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  public readonly min: number;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  public readonly max: number;

  @ApiProperty()
  @IsDefined()
  @IsNumber({}, { each: true })
  public readonly thresholds: number[];
}
