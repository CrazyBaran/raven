import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateOpportunityDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  public readonly pipelineStageId?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  public readonly opportunityTagId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly roundSize?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly valuation?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly proposedInvestment?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly positioning?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly timing?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly underNda?: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  public readonly ndaTerminationDate?: Date;
}
