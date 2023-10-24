import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsUUID } from 'class-validator';

export class FieldUpdateDto {
  @ApiProperty()
  @IsDefined()
  @IsUUID()
  public readonly id: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly value: string;
}
