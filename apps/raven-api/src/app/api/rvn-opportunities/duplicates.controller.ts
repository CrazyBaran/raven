import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';
import { Controller, Get } from '@nestjs/common';
import { ApiOAuth2, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DuplicateDetector, DuplicatesDto } from './duplicate.detector';

@ApiTags('Organisations')
@Controller('duplicates')
export class DuplicatesController {
  public constructor(public readonly duplicateDetector: DuplicateDetector) {}
  @Get()
  @ApiOperation({
    summary: 'Get all duplicate organisations',
  })
  @ApiTags('Organisations')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async getDuplicates(): Promise<DuplicatesDto> {
    return await this.duplicateDetector.getDuplicates();
  }

  @Get('fix-domains')
  @ApiOperation({
    summary: 'Fix all organisations domains',
  })
  @ApiTags('Organisations')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async fixDomains(): Promise<void> {
    await this.duplicateDetector.fixDomains();
  }
}
