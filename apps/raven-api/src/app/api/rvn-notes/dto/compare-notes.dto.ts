import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CompareNotesDto {
  @ApiProperty()
  @IsUUID()
  public readonly firstNote: string;

  @ApiProperty()
  @IsUUID()
  public readonly secondNote: string;
}
