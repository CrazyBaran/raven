import { IsDefined, IsIn, IsString } from 'class-validator';

import { RoleEnum } from '@app/rvns-roles';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ enum: [RoleEnum.TeamAdmin, RoleEnum.User] })
  @IsDefined()
  @IsString()
  @IsIn([RoleEnum.TeamAdmin, RoleEnum.User])
  public readonly role: RoleEnum;
}
