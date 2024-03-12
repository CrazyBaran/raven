import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsUUID } from 'class-validator';

export class ComplexTagDto {
  @ApiProperty()
  @IsDefined()
  @IsUUID()
  public readonly companyTagId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  public readonly opportunityTagId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  public readonly versionTagId: string;
}
