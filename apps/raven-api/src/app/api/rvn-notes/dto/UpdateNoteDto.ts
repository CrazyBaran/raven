import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateNoteDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly opportunityId?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public readonly opportunityAffinityInternalId?: number;
}
