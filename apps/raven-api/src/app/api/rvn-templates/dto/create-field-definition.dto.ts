import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsString, Length } from 'class-validator';

export class CreateFieldDefinitionDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @Length(1, 50)
  public readonly name: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @Length(1, 50)
  public readonly type: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  public readonly order: number;
}
