import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDefined, IsUUID } from 'class-validator';

export class BulkAddOrganisationsDto {
  @ApiProperty()
  @IsDefined()
  @IsArray()
  @IsUUID(undefined, { each: true })
  public readonly shortlistsIds: string[];

  @ApiProperty()
  @IsDefined()
  @IsArray()
  @IsUUID(undefined, { each: true })
  public readonly organisationsIds: string[];
}
