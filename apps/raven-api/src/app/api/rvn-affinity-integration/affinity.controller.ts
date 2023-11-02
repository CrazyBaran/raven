import { GenericResponseSchema, Public } from '@app/rvns-api';
import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOAuth2,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { environment } from '../../../environments/environment';
import { ListDto } from './api/dtos/list.dto';
import { WebhookPayloadDto } from './api/dtos/webhook-payload.dto';
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

  @Public()
  @ApiOperation({ summary: 'Webhook endpoint ' })
  @ApiResponse(GenericResponseSchema())
  @ApiQuery({ name: 'token', type: String, required: true })
  @ApiBody({ type: Object })
  @Post('webhook')
  public webhook(
    @Query('token') token: string,
    @Body() body: unknown,
  ): Promise<void> {
    if (token !== environment.affinity.webhookToken) {
      throw new HttpException('Invalid token', 401);
    }

    return this.affinityProducer.enqueueHandleWebhook(
      body as WebhookPayloadDto,
    );
  }
}
