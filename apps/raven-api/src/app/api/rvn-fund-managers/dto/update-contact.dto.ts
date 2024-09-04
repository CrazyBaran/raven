import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FundManagerContactStrength } from 'rvns-shared';

export class UpdateContactDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly position?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(FundManagerContactStrength)
  public readonly relationStrength?: FundManagerContactStrength;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly linkedin?: string;
}
