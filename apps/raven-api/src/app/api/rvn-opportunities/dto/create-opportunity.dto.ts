import {
  IsDate,
  IsDefined,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  ValidateIf,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateOpportunityDto {
  @ApiProperty()
  @IsDefined()
  @IsUrl()
  @ValidateIf((o) => !o.organisationId)
  public readonly domain?: string;

  @ApiProperty()
  @IsDefined()
  @IsUUID()
  @ValidateIf((o) => !o.domain)
  public readonly organisationId?: string;

  @ApiProperty()
  @IsDefined()
  @IsUUID()
  public readonly workflowTemplateId: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @ValidateIf((o) => o.domain)
  public readonly name?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  public readonly opportunityTagId: string;

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
