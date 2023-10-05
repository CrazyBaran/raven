import { Controller, Get } from '@nestjs/common';
import { ApiOAuth2, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListDto } from './api/dtos/list.dto';
import { Roles } from '@app/rvns-roles-api';
import { RoleEnum } from '@app/rvns-roles';
import { AffinityProducer } from './queues/affinity.producer';

@ApiTags('Affinity')
@Controller('affinity')
export class AffinityController {
  public constructor(private readonly affinityProducer: AffinityProducer) {}

  @ApiOperation({ summary: 'Regenerate ' })
  @ApiResponse({ status: 200, type: [ListDto] })
  @Get('regenerate')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public regenerate(): Promise<void> {
    return this.affinityProducer.enqueueRegenerateAffinityData();
  }
}
