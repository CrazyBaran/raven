import { IsDefined, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateOpportunityDto {
  @ApiProperty()
  @IsDefined()
  @IsUUID()
  public readonly pipelineStageId: string;
}
