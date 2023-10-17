import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID(undefined, { each: true })
  public readonly tagIds?: string[];

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  public readonly templateId?: string;
}
