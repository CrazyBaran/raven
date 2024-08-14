import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTagDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly name: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public readonly order: number;
}
