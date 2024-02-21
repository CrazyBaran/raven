import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDefined, IsUUID } from 'class-validator';

export class DeleteOrganisationFromShortlistDto {
  @ApiProperty()
  @IsDefined()
  @IsArray()
  @IsUUID(undefined, { each: true })
  public readonly organisations: string[];
}
