import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class HeatmapFieldConfigurationDto {
  @ApiProperty()
  @IsOptional()
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
  @IsString()
  public readonly order: 'ASC' | 'DESC';

  @ApiProperty()
  @IsDefined()
  @IsNumber({}, { each: true })
  public readonly thresholds: number[];
}
