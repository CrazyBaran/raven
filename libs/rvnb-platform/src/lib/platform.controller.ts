import {
  GenericResponseSchema,
  EmptyResponseData,
  Public,
} from '@app/rvns-api';

import { PlatformService } from './platform.service';
import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOAuth2,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiOAuth2(['openid'])
@ApiTags('Platform')
@Controller('platform')
export class PlatformController {
  public constructor(private readonly platformService: PlatformService) {}

  @ApiResponse(GenericResponseSchema())
  @Get('health')
  @Public()
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
