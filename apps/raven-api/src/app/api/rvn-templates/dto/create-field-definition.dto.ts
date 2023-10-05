import { FieldDefinitionType } from '@app/rvns-templates';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsIn, IsNumber, IsString, Length } from 'class-validator';

export class CreateFieldDefinitionDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @Length(1, 50)
  public readonly name: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsIn(Object.values(FieldDefinitionType))
  public readonly type: FieldDefinitionType;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  public readonly order: number;
}
