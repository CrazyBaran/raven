import { Transform } from 'class-transformer';
import { IsDefined, IsOptional, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListSharesDto {
  @ApiProperty({
    description:
      'Include resource type in front of the uuid separated with the dash, ' +
      'e.g.: `t-uuid` for team',
  })
  @IsDefined()
  @IsUUID()
  @Transform(({ value }) => value.toString().substring(2))
  public readonly resourceId: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  public readonly actorId: string;
}
