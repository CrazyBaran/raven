import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { FundManagerRelationStrength } from 'rvns-shared';

export class UpdateFundManagerDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(256)
  public readonly name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  public readonly description?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  public readonly strategy?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  public readonly geography?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  public readonly avgCheckSize?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID(undefined, { each: true })
  public readonly industryTags?: string[];

  @IsOptional()
  @IsEnum(FundManagerRelationStrength)
  public readonly relationshipStrength?: FundManagerRelationStrength | null;

  @ApiProperty()
  @IsOptional()
  @IsUUID(undefined, { each: true })
  public readonly keyRelationships?: string[];
}
