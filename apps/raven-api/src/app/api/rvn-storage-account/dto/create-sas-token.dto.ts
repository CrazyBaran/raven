import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSasTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  public readonly fileName: string;
}
