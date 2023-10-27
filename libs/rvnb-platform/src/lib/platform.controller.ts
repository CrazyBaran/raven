import {
  EmptyResponseData,
  GenericResponseSchema,
  Public,
} from '@app/rvns-api';

import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';
import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { ApiOAuth2, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlatformService } from './platform.service';

@ApiOAuth2(['openid'])
@ApiTags('Platform')
@Controller('platform')
export class PlatformController {
  public constructor(private readonly platformService: PlatformService) {}

  @ApiResponse(GenericResponseSchema())
  @Get('health')
  @Public()
  @Roles(RoleEnum.SuperAdmin)
  public async healthCheck(): Promise<EmptyResponseData> {
    // database connection test
    if (!(await this.platformService.testDb())) {
      throw new InternalServerErrorException('Failed to connect to database');
    }

    // redis connection test
    if (!(await this.platformService.testRedis())) {
      throw new InternalServerErrorException('Failed to connect to Redis');
    }
  }
}
