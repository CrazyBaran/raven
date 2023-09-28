import { IsDefined, IsEmail } from 'class-validator';

import { ProfileUpdateDto } from './profile-update.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends ProfileUpdateDto {
  @ApiProperty()
  @IsDefined()
  @IsEmail()
  public readonly email: string;
}
