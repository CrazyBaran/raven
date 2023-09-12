import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsDefined,
  IsIn,
  IsString,
  IsUUID,
} from 'class-validator';

import { ShareRole } from '@app/rvns-acl';

import { ApiProperty } from '@nestjs/swagger';

export class ShareDto {
  @ApiProperty()
  @IsDefined()
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  public readonly actors: string[];

  @ApiProperty()
  @IsDefined()
  @IsUUID()
  @Transform(({ value }) => value.substring(2))
  public readonly resourceId: string;

  @ApiProperty({ enum: [ShareRole.Owner, ShareRole.Editor, ShareRole.Viewer] })
  @IsDefined()
  @IsString()
  @IsIn([ShareRole.Owner, ShareRole.Editor, ShareRole.Viewer])
  public readonly role: ShareRole;
}
