import { IsOptional, IsString, IsUrl } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrganisationDto {
  @ApiProperty()
  @IsOptional()
  @IsUrl(undefined, { each: true })
  public readonly domains?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly name?: string;
}
