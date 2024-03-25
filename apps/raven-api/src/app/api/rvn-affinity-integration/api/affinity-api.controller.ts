import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
import { AffinityApiService } from './affinity-api.service';
import { AffinityCreateFieldValueDto } from './dtos/create-field-value.affinity.dto';
import { AffinityDetailedListDto } from './dtos/detailed-list.affinity.dto';
import { AffinityFieldValueChangeDto } from './dtos/field-value-change.affinity.dto';
import { AffinityFieldValueDto } from './dtos/field-value.affinity.dto';
import { AffinityListDto } from './dtos/list.affinity.affinity.dto';
import { PaginatedAffinityInteractionDto } from './dtos/paginated-interaction.affinity.dto';
import { PaginatedAffinityListEntriesDto } from './dtos/paginated-list-entries.affinity.dto';
import { AffinityPersonDto } from './dtos/person.affinity.dto';
import { AffinityUpdateFieldValueDto } from './dtos/update-field-value.affinity.dto';
import { AffinityWebhookDeleteResponseDto } from './dtos/webhook-delete.affinity.dto';
import { AffinityWebhookSubscribeDto } from './dtos/webhook-subscribe.affinity.dto';
import { AffinityWebhookUpdateDto } from './dtos/webhook-update.affinity.dto';
import { AffinityWebhookDto } from './dtos/webhook.affinity.dto';
import { AffinityWhoAmIDto } from './dtos/whoami.affinity.dto';

@ApiTags('Affinity API')
@Controller('affinity/api')
export class AffinityApiController {
  public constructor(private readonly affinityApiService: AffinityApiService) {}

  @ApiOperation({ summary: 'Get all lists' })
  @ApiResponse({ status: 200, type: [AffinityListDto] })
  @Get('lists')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public getLists(): Promise<AffinityListDto[]> {
    return this.affinityApiService.getLists();
  }

  @ApiOperation({ summary: 'Get list details' })
  @ApiResponse({ status: 200, type: AffinityDetailedListDto })
  @Get('lists/:listId')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public getListDetails(
    @Param('listId') listId: number,
  ): Promise<AffinityDetailedListDto> {
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
  @ApiResponse({ status: 200, type: PaginatedAffinityListEntriesDto })
  @Get('list-entries/:listId')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public getListEntries(
    @Param('listId') listId: number,
    @Query('page_size') pageSize?: number,
    @Query('page_token') pageToken?: string,
  ): Promise<PaginatedAffinityListEntriesDto> {
    return this.affinityApiService.getListEntries(listId, pageSize, pageToken);
  }

  @ApiOperation({ summary: 'Get person' })
  @Get('persons/:personId')
  @ApiResponse({ status: 200, type: AffinityPersonDto })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public getPerson(
    @Param('personId') personId: number,
  ): Promise<AffinityPersonDto> {
    return this.affinityApiService.getPerson(personId);
  }

  @ApiOperation({ summary: 'Get field values' })
  @ApiQuery({ name: 'list_entry_id', required: false, type: Number })
  @ApiQuery({ name: 'person_id', required: false, type: Number })
  @ApiResponse({ status: 200, type: [AffinityFieldValueDto] })
  @Get('field-values')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public getFieldValues(
    @Query('list_entry_id') listEntryId?: number,
    @Query('person_id') personId?: number,
  ): Promise<AffinityFieldValueDto[]> {
    return this.affinityApiService.getFieldValues(listEntryId, personId);
  }

  @ApiOperation({ summary: 'Create a field value' })
  @ApiBody({ type: AffinityCreateFieldValueDto })
  @ApiResponse({ status: 201, type: AffinityFieldValueDto })
  @Post('field-values')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public createFieldValue(
    @Body() dto: unknown,
  ): Promise<AffinityFieldValueDto> {
    return this.affinityApiService.createFieldValue(
      dto as AffinityCreateFieldValueDto,
    );
  }

  @ApiOperation({ summary: 'Update a field value' })
  @ApiBody({ type: AffinityUpdateFieldValueDto })
  @ApiResponse({ status: 200, type: AffinityFieldValueDto })
  @Put('field-values/:fieldValueId')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public updateFieldValue(
    @Param('fieldValueId') fieldValueId: number,
    @Body() dto: unknown,
  ): Promise<AffinityFieldValueDto> {
    return this.affinityApiService.updateFieldValue(
      fieldValueId,
      dto as AffinityUpdateFieldValueDto,
    );
  }

  @ApiOperation({ summary: 'Get field value changes' })
  @ApiQuery({ name: 'field_id', required: true, type: Number })
  @ApiResponse({ status: 200, type: [AffinityFieldValueChangeDto] })
  @Get('field-value-changes')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public getFieldValueChanges(
    @Query('field_id') fieldId: number,
  ): Promise<AffinityFieldValueChangeDto[]> {
    return this.affinityApiService.getFieldValueChanges(fieldId);
  }

  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @ApiOperation({ summary: 'Get current user details' })
  @ApiResponse({ status: 200, type: AffinityWhoAmIDto })
  @Get('auth/whoami')
  public whoAmI(): Promise<AffinityWhoAmIDto> {
    return this.affinityApiService.whoAmI();
  }

  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @ApiOperation({ summary: 'Get all webhooks' })
  @ApiResponse({ status: 200, type: [AffinityWebhookDto] })
  @Get('webhook')
  public getWebhooks(): Promise<AffinityWebhookDto[]> {
    return this.affinityApiService.getWebhooks();
  }

  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @ApiOperation({ summary: 'Get client interactions' })
  @ApiQuery({ name: 'organizationId', required: true, type: Number })
  @ApiQuery({ name: 'start_time', required: true, type: String })
  @ApiQuery({ name: 'end_time', required: true, type: String })
  @ApiQuery({ name: 'type', required: true, type: Number })
  @ApiQuery({ name: 'page_size', required: false, type: Number })
  @ApiQuery({ name: 'page_token', required: false, type: String })
  @ApiResponse({ status: 200, type: [AffinityWebhookDto] })
  @Get('interactions')
  public getClientInteractions(
    @Query('organizationId') organizationId: number,
    @Query('start_time') startTime: string,
    @Query('end_time') endTime: string,
    @Query('type') type: number,
    @Query('page_size') pageSize?: number,
    @Query('page_token') pageToken?: string,
  ): Promise<PaginatedAffinityInteractionDto> {
    return this.affinityApiService.getInteractions(
      organizationId,
      type,
      startTime,
      endTime,
      pageSize,
      pageToken,
    );
  }

  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @ApiOperation({ summary: 'Subscribe to a webhook' })
  @ApiBody({ type: AffinityWebhookSubscribeDto })
  @ApiResponse({ status: 201, type: AffinityWebhookDto })
  @Post('webhook/subscribe')
  public subscribeWebhook(@Body() dto: unknown): Promise<AffinityWebhookDto> {
    return this.affinityApiService.subscribeWebhook(
      dto as AffinityWebhookSubscribeDto,
    );
  }

  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @ApiOperation({ summary: 'Update a webhook' })
  @ApiBody({ type: AffinityWebhookUpdateDto })
  @ApiResponse({ status: 200, type: AffinityWebhookDto })
  @Put('webhook/:webhookId')
  public async updateWebhook(
    @Param('webhookId') webhookId: number,
    @Body() dto: unknown,
  ): Promise<AffinityWebhookDto> {
    return this.affinityApiService.updateWebhook(
      webhookId,
      dto as AffinityWebhookUpdateDto,
    );
  }

  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @ApiOperation({ summary: 'Delete a webhook' })
  @ApiResponse({ status: 200, type: AffinityWebhookDeleteResponseDto })
  @Delete('webhook/:webhookId')
  public deleteWebhook(
    @Param('webhookId') webhookId: number,
  ): Promise<AffinityWebhookDeleteResponseDto> {
    return this.affinityApiService.deleteWebhook(webhookId);
  }
}
