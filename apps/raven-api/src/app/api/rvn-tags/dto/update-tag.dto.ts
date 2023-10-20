import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class UpdateTagDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly name: string;
}
