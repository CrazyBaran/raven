import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateFundManagerDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @MaxLength(256)
  public readonly name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  public readonly description?: string;
}
