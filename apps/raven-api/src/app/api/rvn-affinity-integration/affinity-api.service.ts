import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';
import { PaginatedListEntriesDto } from './dtos/api/paginated-list-entries.dto';
import { DetailedListDto } from './dtos/api/detailed-list.dto';
import { ListDto } from './dtos/api/list.dto';
import { FieldValueDto } from './dtos/api/field-value.dto';
import { CreateFieldValueDto } from './dtos/api/create-field-value.dto';
import { UpdateFieldValueDto } from './dtos/api/update-field-value.dto';
import { FieldValueChangeDto } from './dtos/api/field-value-change.dto';
import { WhoAmIDto } from './dtos/api/whoami.dto';
import { WebhookDeleteResponseDto } from './dtos/api/webhook-delete.dto';
import { WebhookDto } from './dtos/api/webhook.dto';
import { WebhookUpdateDto } from './dtos/api/webhook-update.dto';
import { WebhookSubscribeDto } from './dtos/api/webhook-subscribe.dto';

@Injectable()
export class AffinityApiService {
  private readonly apiKey: string;
  private readonly baseURL: string = 'https://api.affinity.co';

  public constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>('AFFINITY_API_KEY');
  }

  private get headers(): Record<string, string> {
    const base64Credentials = Buffer.from(`:${this.apiKey}`).toString('base64');
    return {
      Authorization: `Basic ${base64Credentials}`,
      'Content-Type': 'application/json',
    };
  }

  public async getLists(): Promise<ListDto[]> {
    return await this.httpService
      .get<ListDto[]>(`/lists`, {
        baseURL: this.baseURL,
        headers: this.headers,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async getListDetails(listId: number): Promise<DetailedListDto> {
    return await this.httpService
      .get<DetailedListDto>(`/lists/${listId}`, {
        baseURL: this.baseURL,
        headers: this.headers,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async getListEntries(
    listId: number,
    pageSize = 500,
    pageToken?: string,
  ): Promise<PaginatedListEntriesDto> {
    return await this.httpService
      .get<PaginatedListEntriesDto>(`/lists/${listId}/list-entries`, {
        baseURL: this.baseURL,
        headers: this.headers,
        params: {
          page_size: pageSize || 500,
          ...(pageToken && { page_token: pageToken }),
        },
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async getFieldValues(listEntryId: number): Promise<FieldValueDto[]> {
    return await this.httpService
      .get<FieldValueDto[]>(`/field-values`, {
        baseURL: this.baseURL,
        headers: this.headers,
        params: { list_entry_id: listEntryId },
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async createFieldValue(
    dto: CreateFieldValueDto,
  ): Promise<FieldValueDto> {
    return await this.httpService
      .post<FieldValueDto>(`/field-values`, dto, {
        baseURL: this.baseURL,
        headers: this.headers,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async updateFieldValue(
    fieldValueId: number,
    dto: UpdateFieldValueDto,
  ): Promise<FieldValueDto> {
    return await this.httpService
      .put<FieldValueDto>(`/field-values/${fieldValueId}`, dto, {
        baseURL: this.baseURL,
        headers: this.headers,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async getFieldValueChanges(
    fieldId: number,
  ): Promise<FieldValueChangeDto[]> {
    return await this.httpService
      .get<FieldValueChangeDto[]>(`/field-value-changes`, {
        baseURL: this.baseURL,
        headers: this.headers,
        params: { field_id: fieldId },
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async whoAmI(): Promise<WhoAmIDto> {
    return await this.httpService
      .get<WhoAmIDto>('/auth/whoami', {
        baseURL: this.baseURL,
        headers: this.headers,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async getWebhooks(): Promise<WebhookDto[]> {
    return await this.httpService
      .get<WebhookDto[]>('/webhook', {
        baseURL: this.baseURL,
        headers: this.headers,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async subscribeWebhook(dto: WebhookSubscribeDto): Promise<WebhookDto> {
    return await this.httpService
      .post<WebhookDto>('/webhook/subscribe', dto, {
        baseURL: this.baseURL,
        headers: this.headers,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async updateWebhook(
    webhookId: number,
    dto: WebhookUpdateDto,
  ): Promise<WebhookDto> {
    return await this.httpService
      .put<WebhookDto>(`/webhook/${webhookId}`, dto, {
        baseURL: this.baseURL,
        headers: this.headers,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async deleteWebhook(
    webhookId: number,
  ): Promise<WebhookDeleteResponseDto> {
    return await this.httpService
      .delete<WebhookDeleteResponseDto>(`/webhook/${webhookId}`, {
        baseURL: this.baseURL,
        headers: this.headers,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }
}
