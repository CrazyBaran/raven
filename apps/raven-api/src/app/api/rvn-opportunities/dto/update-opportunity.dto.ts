import { IsOptional, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateOpportunityDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  public readonly pipelineStageId?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  public readonly tagId?: string;
}
