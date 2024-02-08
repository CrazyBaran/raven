import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CompanyStatus } from 'rvns-shared';
import { PipelineStageConfigurationDto } from './pipeline-stage-configuration.dto';
import { ShowFieldsConfigurationDto } from './show-fields-configuration.dto';

export class UpdatePipelineStageDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly displayName?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public readonly order?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly mappedFrom?: string;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  public readonly configuration?: PipelineStageConfigurationDto | null;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShowFieldsConfigurationDto)
  public readonly showFields?: ShowFieldsConfigurationDto[];

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public readonly isHidden?: boolean;

  @ApiProperty({
    type: 'enum',
    enum: CompanyStatus,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(CompanyStatus)
  public readonly relatedCompanyStatus?: CompanyStatus | null;
}
