import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateTemplateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  public readonly name: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public readonly isDefault?: boolean;
}
