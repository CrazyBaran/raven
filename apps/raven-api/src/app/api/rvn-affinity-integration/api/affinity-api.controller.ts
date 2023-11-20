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
import { CreateFieldValueDto } from './dtos/create-field-value.dto';
import { DetailedListDto } from './dtos/detailed-list.dto';
import { FieldValueChangeDto } from './dtos/field-value-change.dto';
import { FieldValueDto } from './dtos/field-value.dto';
import { ListDto } from './dtos/list.dto';
import { PaginatedListEntriesDto } from './dtos/paginated-list-entries.dto';
import { PersonDto } from './dtos/person.dto';
import { UpdateFieldValueDto } from './dtos/update-field-value.dto';
import { WebhookDeleteResponseDto } from './dtos/webhook-delete.dto';
import { WebhookSubscribeDto } from './dtos/webhook-subscribe.dto';
import { WebhookUpdateDto } from './dtos/webhook-update.dto';
import { WebhookDto } from './dtos/webhook.dto';
import { WhoAmIDto } from './dtos/whoami.dto';

@ApiTags('Affinity API')
@Controller('affinity/api')
export class AffinityApiController {
  public constructor(private readonly affinityApiService: AffinityApiService) {}

  @ApiOperation({ summary: 'Get all lists' })
  @ApiResponse({ status: 200, type: [ListDto] })
  @Get('lists')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public getLists(): Promise<ListDto[]> {
    return this.affinityApiService.getLists();
  }

  @ApiOperation({ summary: 'Get list details' })
  @ApiResponse({ status: 200, type: DetailedListDto })
  @Get('lists/:listId')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
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
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public getListEntries(
    @Param('listId') listId: number,
    @Query('page_size') pageSize?: number,
    @Query('page_token') pageToken?: string,
  ): Promise<PaginatedListEntriesDto> {
    return this.affinityApiService.getListEntries(listId, pageSize, pageToken);
  }

  @ApiOperation({ summary: 'Get person' })
  @Get('persons/:personId')
  @ApiResponse({ status: 200, type: PersonDto })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public getPerson(@Param('personId') personId: number): Promise<PersonDto> {
    return this.affinityApiService.getPerson(personId);
  }

  @ApiOperation({ summary: 'Get field values' })
  @ApiQuery({ name: 'list_entry_id', required: false, type: Number })
  @ApiQuery({ name: 'person_id', required: false, type: Number })
  @ApiResponse({ status: 200, type: [FieldValueDto] })
  @Get('field-values')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public getFieldValues(
    @Query('list_entry_id') listEntryId?: number,
    @Query('person_id') personId?: number,
  ): Promise<FieldValueDto[]> {
    return this.affinityApiService.getFieldValues(listEntryId, personId);
  }

  @ApiOperation({ summary: 'Create a field value' })
  @ApiBody({ type: CreateFieldValueDto })
  @ApiResponse({ status: 201, type: FieldValueDto })
  @Post('field-values')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public createFieldValue(@Body() dto: unknown): Promise<FieldValueDto> {
    return this.affinityApiService.createFieldValue(dto as CreateFieldValueDto);
  }

  @ApiOperation({ summary: 'Update a field value' })
  @ApiBody({ type: UpdateFieldValueDto })
  @ApiResponse({ status: 200, type: FieldValueDto })
  @Put('field-values/:fieldValueId')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public updateFieldValue(
    @Param('fieldValueId') fieldValueId: number,
    @Body() dto: unknown,
  ): Promise<FieldValueDto> {
    return this.affinityApiService.updateFieldValue(
      fieldValueId,
      dto as UpdateFieldValueDto,
    );
  }

  @ApiOperation({ summary: 'Get field value changes' })
  @ApiQuery({ name: 'field_id', required: true, type: Number })
  @ApiResponse({ status: 200, type: [FieldValueChangeDto] })
  @Get('field-value-changes')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public getFieldValueChanges(
    @Query('field_id') fieldId: number,
  ): Promise<FieldValueChangeDto[]> {
    return this.affinityApiService.getFieldValueChanges(fieldId);
  }

  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @ApiOperation({ summary: 'Get current user details' })
  @ApiResponse({ status: 200, type: WhoAmIDto })
  @Get('auth/whoami')
  public whoAmI(): Promise<WhoAmIDto> {
    return this.affinityApiService.whoAmI();
  }

  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @ApiOperation({ summary: 'Get all webhooks' })
  @ApiResponse({ status: 200, type: [WebhookDto] })
  @Get('webhook')
  public getWebhooks(): Promise<WebhookDto[]> {
    return this.affinityApiService.getWebhooks();
  }

  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @ApiOperation({ summary: 'Subscribe to a webhook' })
  @ApiBody({ type: WebhookSubscribeDto })
  @ApiResponse({ status: 201, type: WebhookDto })
  @Post('webhook/subscribe')
  public subscribeWebhook(@Body() dto: unknown): Promise<WebhookDto> {
    return this.affinityApiService.subscribeWebhook(dto as WebhookSubscribeDto);
  }

  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @ApiOperation({ summary: 'Update a webhook' })
  @ApiBody({ type: WebhookUpdateDto })
  @ApiResponse({ status: 200, type: WebhookDto })
  @Put('webhook/:webhookId')
  public async updateWebhook(
    @Param('webhookId') webhookId: number,
    @Body() dto: unknown,
  ): Promise<WebhookDto> {
    return this.affinityApiService.updateWebhook(
      webhookId,
      dto as WebhookUpdateDto,
    );
  }

  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @ApiOperation({ summary: 'Delete a webhook' })
  @ApiResponse({ status: 200, type: WebhookDeleteResponseDto })
  @Delete('webhook/:webhookId')
  public deleteWebhook(
    @Param('webhookId') webhookId: number,
  ): Promise<WebhookDeleteResponseDto> {
    return this.affinityApiService.deleteWebhook(webhookId);
  }
}
