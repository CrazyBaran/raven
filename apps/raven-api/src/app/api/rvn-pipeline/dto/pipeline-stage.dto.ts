import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CompanyStatus } from 'rvns-shared';

export class PipelineStageDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  public displayName: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public mappedFrom: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  @Min(1)
  public order: number;

  @ApiProperty({
    type: 'enum',
    enum: CompanyStatus,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(CompanyStatus)
  public readonly relatedCompanyStatus?: CompanyStatus | null;
}
