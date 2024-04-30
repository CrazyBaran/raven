import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsUUID } from 'class-validator';

export class RestoreNoteVersionDto {
  @ApiProperty()
  @IsDefined()
  @IsUUID()
  public readonly versionId: string;
}
