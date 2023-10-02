import { IsDefined, IsString, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateTemplateDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @Length(1, 50)
  public readonly name: string;
}
