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
import { AffinityService } from './affinity.service';
import { ListDto } from './dtos/list.dto';
import { DetailedListDto } from './dtos/detailed-list.dto';
import { PaginatedListEntriesDto } from './dtos/paginated-list-entries.dto';
import { FieldValueDto } from './dtos/field-value.dto';
import { CreateFieldValueDto } from './dtos/create-field-value.dto';
import { UpdateFieldValueDto } from './dtos/update-field-value.dto';
import { FieldValueChangeDto } from './dtos/field-value-change.dto';
import { Roles } from '@app/rvns-roles-api';
import { RoleEnum } from '@app/rvns-roles';
import { WhoAmIDto } from './dtos/whoami.dto';
import { WebhookDeleteResponseDto } from './dtos/webhook-delete.dto';
import { WebhookDto } from './dtos/webhook.dto';
import { WebhookUpdateDto } from './dtos/webhook-update.dto';
import { WebhookSubscribeDto } from './dtos/webhook-subscribe.dto';

@ApiTags('Affinity')
@Controller('affinity')
export class AffinityController {
  public constructor(private readonly affinityService: AffinityService) {}

  @ApiOperation({ summary: 'Get all lists' })
  @ApiResponse({ status: 200, type: [ListDto] })
  @Get('lists')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public getLists(): Promise<ListDto[]> {
    return this.affinityService.getLists();
  }

  @ApiOperation({ summary: 'Get list details' })
  @ApiResponse({ status: 200, type: DetailedListDto })
  @Get('lists/:listId')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public getListDetails(
    @Param('listId') listId: number,
  ): Promise<DetailedListDto> {
    return this.affinityService.getListDetails(listId);
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
    return this.affinityService.getListEntries(listId, pageSize, pageToken);
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
    return this.affinityService.getFieldValues(listEntryId);
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
    return this.affinityService.createFieldValue(dto);
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
    return this.affinityService.updateFieldValue(fieldValueId, dto);
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
    return this.affinityService.getFieldValueChanges(fieldId);
  }

  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  @ApiOperation({ summary: 'Get current user details' })
  @ApiResponse({ status: 200, type: WhoAmIDto })
  @Get('auth/whoami')
  public whoAmI(): Promise<WhoAmIDto> {
    return this.affinityService.whoAmI();
  }

  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  @ApiOperation({ summary: 'Get all webhooks' })
  @ApiResponse({ status: 200, type: [WebhookDto] })
  @Get('webhook')
  public getWebhooks(): Promise<WebhookDto[]> {
    return this.affinityService.getWebhooks();
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
    return this.affinityService.subscribeWebhook(dto);
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
    return this.affinityService.updateWebhook(webhookId, dto);
  }

  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  @ApiOperation({ summary: 'Delete a webhook' })
  @ApiResponse({ status: 200, type: WebhookDeleteResponseDto })
  @Delete('webhook/:webhookId')
  public deleteWebhook(
    @Param('webhookId') webhookId: number,
  ): Promise<WebhookDeleteResponseDto> {
    return this.affinityService.deleteWebhook(webhookId);
  }
}
