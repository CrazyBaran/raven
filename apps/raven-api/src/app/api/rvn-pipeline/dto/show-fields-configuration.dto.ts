import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class ShowFieldsConfigurationDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  public readonly fieldName: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  public readonly displayName: string;
}
