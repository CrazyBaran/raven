import {
  IsDefined,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateOpportunityDto {
  @ApiProperty()
  @IsDefined()
  @IsUrl()
  public readonly domain: string;

  @ApiProperty()
  @IsDefined()
  @IsUUID()
  public readonly workflowTemplateId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly name?: string;
}
