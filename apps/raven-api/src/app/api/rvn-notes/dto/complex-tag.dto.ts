import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsUUID } from 'class-validator';

export class ComplexTagDto {
  @ApiProperty()
  @IsDefined()
  @IsUUID()
  public readonly companyTagId: string;

  @ApiProperty()
  @IsDefined()
  @IsUUID()
  public readonly opportunityTagId: string;
}
