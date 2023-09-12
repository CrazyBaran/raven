import { IsDefined, IsString, IsStrongPassword, Length } from 'class-validator';

import { MIN_PASS_LENGTH } from '../users.service';
import { TokenDto } from './token.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordByTokenDto extends TokenDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsStrongPassword({ minLength: MIN_PASS_LENGTH })
  @Length(MIN_PASS_LENGTH, 255)
  public readonly password: string;
}
