import { IsDefined, IsString, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ProfileUpdateDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @Length(3, 255)
  public readonly name: string;
}
