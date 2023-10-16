import { IsDefined, IsString, IsUrl } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganisationDto {
  @ApiProperty()
  @IsDefined()
  @IsUrl()
  public readonly domain: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly name: string;
}
