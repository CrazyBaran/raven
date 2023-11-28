import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsUUID } from 'class-validator';

export class UpdateFileDto {
  @ApiProperty()
  @IsDefined()
  @IsUUID(undefined, { each: true })
  public readonly tagIds?: string[];
}
