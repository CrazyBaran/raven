import { GenericResponseSchema, Public } from '@app/rvns-api';
import { Body, Controller, HttpException, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { environment } from '../../../environments/environment';
import { AffinityWebhookPayloadDto } from './api/dtos/webhook-payload.affinity.dto';
import { AffinityProducer } from './queues/affinity.producer';

@ApiTags('Affinity')
@Controller('affinity')
export class AffinityController {
  public constructor(private readonly affinityProducer: AffinityProducer) {}

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
      body as AffinityWebhookPayloadDto,
    );
  }
}
