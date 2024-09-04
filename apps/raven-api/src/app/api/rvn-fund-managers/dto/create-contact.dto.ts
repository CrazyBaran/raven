import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsOptional, IsString } from 'class-validator';
import { FundManagerContactStrength } from 'rvns-shared';

export class CreateContactDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly name: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly position: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(FundManagerContactStrength)
  public readonly relationStrength: FundManagerContactStrength;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly email: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly linkedin: string;
}
