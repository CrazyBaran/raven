import { IsDefined, IsNumber, IsString, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateTabDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @Length(1, 50)
  public readonly name: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  public readonly order: number;
}
