import { IsDefined, IsEmail } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { ProfileUpdateDto } from './profile-update.dto';

export class CreateUserDto extends ProfileUpdateDto {
  @ApiProperty()
  @IsDefined()
  @IsEmail()
  public readonly email: string;
}
