import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class UpdateNoteFieldDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly value: string;
}
