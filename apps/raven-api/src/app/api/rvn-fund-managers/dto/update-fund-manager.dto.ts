import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Currency, FundManagerRelationStrength } from 'rvns-shared';

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
  @IsInt()
  public readonly avgCheckSize?: number;

  @IsOptional()
  @IsEnum(Currency)
  public readonly avgCheckSizeCurrency?: Currency | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  public readonly aum?: number;

  @IsOptional()
  @IsEnum(Currency)
  public readonly aumCurrency?: Currency | null;

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
