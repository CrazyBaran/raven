import { TagTypeEnum } from '@app/rvns-tags';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsUUID, ValidateIf } from 'class-validator';

export class CreateTagDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly name: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly type: TagTypeEnum;

  @ApiProperty()
  @ValidateIf((o) => o.type === TagTypeEnum.People)
  @IsDefined()
  @IsUUID()
  public readonly userId?: string;

  @ApiProperty()
  @ValidateIf(
    (o) => o.type === TagTypeEnum.Company || o.type === TagTypeEnum.Investor,
  )
  @IsDefined()
  @IsUUID()
  public readonly organisationId?: string;

  @ApiProperty()
  @ValidateIf((o) => o.type === TagTypeEnum.Tab)
  @IsDefined()
  @IsUUID()
  public readonly tabId?: string;
}
