import { IsOptional, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateOpportunityDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  public readonly organisationId?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  public readonly domain?: string;
}
