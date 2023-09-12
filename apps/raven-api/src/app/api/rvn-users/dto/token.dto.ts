import { IsDefined, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly token: string;
}
