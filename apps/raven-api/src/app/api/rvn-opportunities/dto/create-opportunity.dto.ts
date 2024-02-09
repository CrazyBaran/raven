import {
  IsDefined,
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
  @IsString()
  @ValidateIf((o) => o.domain)
  public readonly name?: string;
}
