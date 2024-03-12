import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';
import { Controller, Get, Patch } from '@nestjs/common';
import { ApiOAuth2, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CandidatesDto,
  DuplicateDetector,
  DuplicatesDto,
} from './duplicate.detector';

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

  @Patch('candidates')
  @ApiOperation({
    summary: 'Get deletion candidates',
  })
  @ApiTags('Organisations')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async getCandidates() //@Body() body: DuplicatesDto,
  : Promise<CandidatesDto> {
    const body = await this.duplicateDetector.getDuplicates();
    return await this.duplicateDetector.getDeletionCandidates(body);
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
