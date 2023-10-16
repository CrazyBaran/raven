import { IsDefined, IsOptional, IsString, IsUrl } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateOpportunityDto {
  @ApiProperty()
  @IsDefined()
  @IsUrl()
  public readonly domain: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly name?: string;
}
