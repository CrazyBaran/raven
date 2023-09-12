import { IsDefined, IsEmail, IsIn, IsString, IsUUID } from 'class-validator';

import { RoleEnum } from '@app/rvns-roles';

import { ProfileUpdateDto } from './profile-update.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends ProfileUpdateDto {
  @ApiProperty()
  @IsDefined()
  @IsEmail()
  public readonly email: string;

  @ApiProperty()
  @IsDefined()
  @IsUUID()
  public readonly teamId: string;

  @ApiProperty({ enum: [RoleEnum.TeamAdmin, RoleEnum.User] })
  @IsDefined()
  @IsString()
  @IsIn([RoleEnum.TeamAdmin, RoleEnum.User])
  public readonly role: RoleEnum;
}
