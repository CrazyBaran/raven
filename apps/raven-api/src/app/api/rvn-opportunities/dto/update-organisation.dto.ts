import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { CompanyStatus } from 'rvns-shared';

export class UpdateOrganisationDto {
  @ApiProperty()
  @IsOptional()
  @IsUrl(undefined, { each: true })
  public readonly domains?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly customDescription?: string;

  @ApiProperty({
    type: 'enum',
    enum: CompanyStatus,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(CompanyStatus)
  public readonly companyStatus?: CompanyStatus | null;
}
