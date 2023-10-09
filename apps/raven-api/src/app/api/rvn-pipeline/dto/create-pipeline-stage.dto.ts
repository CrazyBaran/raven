import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsString } from 'class-validator';

export class CreatePipelineStageDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  public readonly displayName: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  public readonly order: number;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly mappedFrom: string;
}
