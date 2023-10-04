import {
  Controller,
  Get,
  Param,
  Query,
  Body,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBody,
  ApiResponse,
  ApiOAuth2,
} from '@nestjs/swagger';
import { AffinityApiService } from './affinity-api.service';
import { ListDto } from './dtos/api/list.dto';
import { DetailedListDto } from './dtos/api/detailed-list.dto';
import { PaginatedListEntriesDto } from './dtos/api/paginated-list-entries.dto';
import { FieldValueDto } from './dtos/api/field-value.dto';
import { CreateFieldValueDto } from './dtos/api/create-field-value.dto';
import { UpdateFieldValueDto } from './dtos/api/update-field-value.dto';
import { FieldValueChangeDto } from './dtos/api/field-value-change.dto';
import { Roles } from '@app/rvns-roles-api';
import { RoleEnum } from '@app/rvns-roles';
import { WhoAmIDto } from './dtos/api/whoami.dto';
import { WebhookDeleteResponseDto } from './dtos/api/webhook-delete.dto';
import { WebhookDto } from './dtos/api/webhook.dto';
import { WebhookUpdateDto } from './dtos/api/webhook-update.dto';
import { WebhookSubscribeDto } from './dtos/api/webhook-subscribe.dto';

@ApiTags('Affinity API')
@Controller('affinity/api')
export class AffinityApiController {
  public constructor(private readonly affinityApiService: AffinityApiService) {}

  @ApiOperation({ summary: 'Get all lists' })
  @ApiResponse({ status: 200, type: [ListDto] })
  @Get('lists')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public getLists(): Promise<ListDto[]> {
    return this.affinityApiService.getLists();
  }

  @ApiOperation({ summary: 'Get list details' })
  @ApiResponse({ status: 200, type: DetailedListDto })
  @Get('lists/:listId')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public getListDetails(
    @Param('listId') listId: number,
  ): Promise<DetailedListDto> {
    return this.affinityApiService.getListDetails(listId);
  }

  @ApiOperation({ summary: 'Get list entries' })
  @ApiQuery({
    name: 'page_size',
    required: false,
    type: Number,
    description: 'Size of the page',
  })
  @ApiQuery({
    name: 'page_token',
    required: false,
    type: String,
    description: 'Token for the next page',
  })
  @ApiResponse({ status: 200, type: PaginatedListEntriesDto })
  @Get('list-entries/:listId')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public getListEntries(
    @Param('listId') listId: number,
    @Query('page_size') pageSize?: number,
    @Query('page_token') pageToken?: string,
  ): Promise<PaginatedListEntriesDto> {
    return this.affinityApiService.getListEntries(listId, pageSize, pageToken);
  }

  @ApiOperation({ summary: 'Get field values' })
  @ApiQuery({ name: 'list_entry_id', required: true, type: Number })
  @ApiResponse({ status: 200, type: [FieldValueDto] })
  @Get('field-values')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public getFieldValues(
    @Query('list_entry_id') listEntryId: number,
  ): Promise<FieldValueDto[]> {
    return this.affinityApiService.getFieldValues(listEntryId);
  }

  @ApiOperation({ summary: 'Create a field value' })
  @ApiBody({ type: CreateFieldValueDto })
  @ApiResponse({ status: 201, type: FieldValueDto })
  @Post('field-values')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public createFieldValue(
    @Body() dto: CreateFieldValueDto,
  ): Promise<FieldValueDto> {
    return this.affinityApiService.createFieldValue(dto);
  }

  @ApiOperation({ summary: 'Update a field value' })
  @ApiBody({ type: UpdateFieldValueDto })
  @ApiResponse({ status: 200, type: FieldValueDto })
  @Put('field-values/:fieldValueId')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public updateFieldValue(
    @Param('fieldValueId') fieldValueId: number,
    @Body() dto: UpdateFieldValueDto,
  ): Promise<FieldValueDto> {
    return this.affinityApiService.updateFieldValue(fieldValueId, dto);
  }

  @ApiOperation({ summary: 'Get field value changes' })
  @ApiQuery({ name: 'field_id', required: true, type: Number })
  @ApiResponse({ status: 200, type: [FieldValueChangeDto] })
  @Get('field-value-changes')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public getFieldValueChanges(
    @Query('field_id') fieldId: number,
  ): Promise<FieldValueChangeDto[]> {
    return this.affinityApiService.getFieldValueChanges(fieldId);
  }

  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  @ApiOperation({ summary: 'Get current user details' })
  @ApiResponse({ status: 200, type: WhoAmIDto })
  @Get('auth/whoami')
  public whoAmI(): Promise<WhoAmIDto> {
    return this.affinityApiService.whoAmI();
  }

  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  @ApiOperation({ summary: 'Get all webhooks' })
  @ApiResponse({ status: 200, type: [WebhookDto] })
  @Get('webhook')
  public getWebhooks(): Promise<WebhookDto[]> {
    return this.affinityApiService.getWebhooks();
  }

  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  @ApiOperation({ summary: 'Subscribe to a webhook' })
  @ApiBody({ type: WebhookSubscribeDto })
  @ApiResponse({ status: 201, type: WebhookDto })
  @Post('webhook/subscribe')
  public subscribeWebhook(
    @Body() dto: WebhookSubscribeDto,
  ): Promise<WebhookDto> {
    return this.affinityApiService.subscribeWebhook(dto);
  }

  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  @ApiOperation({ summary: 'Update a webhook' })
  @ApiBody({ type: WebhookUpdateDto })
  @ApiResponse({ status: 200, type: WebhookDto })
  @Put('webhook/:webhookId')
  public updateWebhook(
    @Param('webhookId') webhookId: number,
    @Body() dto: WebhookUpdateDto,
  ): Promise<WebhookDto> {
    return this.affinityApiService.updateWebhook(webhookId, dto);
  }

  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  @ApiOperation({ summary: 'Delete a webhook' })
  @ApiResponse({ status: 200, type: WebhookDeleteResponseDto })
  @Delete('webhook/:webhookId')
  public deleteWebhook(
    @Param('webhookId') webhookId: number,
  ): Promise<WebhookDeleteResponseDto> {
    return this.affinityApiService.deleteWebhook(webhookId);
  }
}
