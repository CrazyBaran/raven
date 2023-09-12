import { IsDefined, IsString, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @Length(3, 20)
  public readonly name: string;
}
