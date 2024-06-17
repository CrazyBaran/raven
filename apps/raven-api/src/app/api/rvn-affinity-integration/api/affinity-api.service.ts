import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AffinityCreateFieldValueDto } from './dtos/create-field-value.affinity.dto';
import { AffinityDetailedListDto } from './dtos/detailed-list.affinity.dto';
import { AffinityFieldValueChangeDto } from './dtos/field-value-change.affinity.dto';
import { AffinityFieldValueDto } from './dtos/field-value.affinity.dto';
import { AffinityFieldDto } from './dtos/field.affinity.dto';
import { AffinityInteractionType } from './dtos/interaction.affinity.dto';
import { AffinityListEntryDto } from './dtos/list-entry.affinity.dto';
import { AffinityListDto } from './dtos/list.affinity.affinity.dto';
import { AffinityOrganizationDto } from './dtos/organization.affinity.dto';
import { PaginatedAffinityInteractionDto } from './dtos/paginated-interaction.affinity.dto';
import { PaginatedAffinityListEntriesDto } from './dtos/paginated-list-entries.affinity.dto';
import { PaginatedAffinityOrganizationsDto } from './dtos/paginated-organizations.affinity.dto';
import { AffinityPersonDto } from './dtos/person.affinity.dto';
import { AffinityUpdateFieldValueDto } from './dtos/update-field-value.affinity.dto';
import { AffinityWebhookDeleteResponseDto } from './dtos/webhook-delete.affinity.dto';
import { AffinityWebhookSubscribeDto } from './dtos/webhook-subscribe.affinity.dto';
import { AffinityWebhookUpdateDto } from './dtos/webhook-update.affinity.dto';
import { AffinityWebhookDto } from './dtos/webhook.affinity.dto';
import { AffinityWhoAmIDto } from './dtos/whoami.affinity.dto';

@Injectable()
export class AffinityApiService {
  private readonly baseURL: string = 'https://api.affinity.co';

  public constructor(private readonly httpService: HttpService) {}

  private get headers(): Record<string, string> {
    const base64Credentials = Buffer.from(
      `:${environment.affinity.apiKey}`,
    ).toString('base64');
    return {
      Authorization: `Basic ${base64Credentials}`,
      'Content-Type': 'application/json',
    };
  }

  public async getLists(): Promise<AffinityListDto[]> {
    return await this.httpService
      .get<AffinityListDto[]>(`/lists`, {
        baseURL: this.baseURL,
        headers: this.headers,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async getListDetails(
    listId: number,
  ): Promise<AffinityDetailedListDto> {
    return await this.httpService
      .get<AffinityDetailedListDto>(`/lists/${listId}`, {
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
  ): Promise<PaginatedAffinityListEntriesDto> {
    return await this.httpService
      .get<PaginatedAffinityListEntriesDto>(`/lists/${listId}/list-entries`, {
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

  public async getPerson(personId: number): Promise<AffinityPersonDto> {
    return await this.httpService
      .get<AffinityPersonDto>(`/persons/${personId}`, {
        baseURL: this.baseURL,
        headers: this.headers,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async getFieldValues(
    listEntryId?: number,
    personId?: number,
  ): Promise<AffinityFieldValueDto[]> {
    const params = {};
    if (listEntryId) {
      params['list_entry_id'] = listEntryId;
    }
    if (personId) {
      params['person_id'] = personId;
    }
    return await this.httpService
      .get<AffinityFieldValueDto[]>(`/field-values`, {
        baseURL: this.baseURL,
        headers: this.headers,
        params: params,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async createFieldValue(
    dto: AffinityCreateFieldValueDto,
  ): Promise<AffinityFieldValueDto> {
    return await this.httpService
      .post<AffinityFieldValueDto>(`/field-values`, dto, {
        baseURL: this.baseURL,
        headers: this.headers,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async updateFieldValue(
    fieldValueId: number,
    dto: AffinityUpdateFieldValueDto,
  ): Promise<AffinityFieldValueDto> {
    return await this.httpService
      .put<AffinityFieldValueDto>(`/field-values/${fieldValueId}`, dto, {
        baseURL: this.baseURL,
        headers: this.headers,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async getFields(listId: number): Promise<AffinityFieldDto[]> {
    return await this.httpService
      .get<AffinityFieldDto[]>(`/fields`, {
        baseURL: this.baseURL,
        headers: this.headers,
        params: { list_id: listId },
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async getFieldValueChanges(
    fieldId: number,
  ): Promise<AffinityFieldValueChangeDto[]> {
    return await this.httpService
      .get<AffinityFieldValueChangeDto[]>(`/field-value-changes`, {
        baseURL: this.baseURL,
        headers: this.headers,
        params: { field_id: fieldId },
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async getOrganizations(
    pageSize = 500,
    pageToken?: string,
  ): Promise<PaginatedAffinityOrganizationsDto> {
    return await this.httpService
      .get<PaginatedAffinityOrganizationsDto>(`/organizations`, {
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

  public async createOrganization(
    name: string,
    domain: string,
  ): Promise<AffinityOrganizationDto> {
    return await this.httpService
      .post<AffinityOrganizationDto>(
        `/organizations`,
        { name, domain },
        {
          baseURL: this.baseURL,
          headers: this.headers,
        },
      )
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async whoAmI(): Promise<AffinityWhoAmIDto> {
    return await this.httpService
      .get<AffinityWhoAmIDto>('/auth/whoami', {
        baseURL: this.baseURL,
        headers: this.headers,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async getWebhooks(): Promise<AffinityWebhookDto[]> {
    return await this.httpService
      .get<AffinityWebhookDto[]>('/webhook', {
        baseURL: this.baseURL,
        headers: this.headers,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async subscribeWebhook(
    dto: AffinityWebhookSubscribeDto,
  ): Promise<AffinityWebhookDto> {
    return await this.httpService
      .post<AffinityWebhookDto>('/webhook/subscribe', dto, {
        baseURL: this.baseURL,
        headers: this.headers,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async updateWebhook(
    webhookId: number,
    dto: AffinityWebhookUpdateDto,
  ): Promise<AffinityWebhookDto> {
    return await this.httpService
      .put<AffinityWebhookDto>(`/webhook/${webhookId}`, dto, {
        baseURL: this.baseURL,
        headers: this.headers,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async deleteWebhook(
    webhookId: number,
  ): Promise<AffinityWebhookDeleteResponseDto> {
    return await this.httpService
      .delete<AffinityWebhookDeleteResponseDto>(`/webhook/${webhookId}`, {
        baseURL: this.baseURL,
        headers: this.headers,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async createListEntry(
    defaultListId: number,
    entity_id: number,
  ): Promise<AffinityListEntryDto> {
    return await this.httpService
      .post<AffinityListEntryDto>(
        `/lists/${defaultListId}/list-entries`,
        { entity_id },
        {
          baseURL: this.baseURL,
          headers: this.headers,
        },
      )
      .pipe(map((response) => response.data))
      .toPromise();
  }

  public async getInteractions(
    organizationId: number,
    type: AffinityInteractionType,
    start_time: string,
    end_time: string,
    page_size?: number,
    page_token?: string,
  ): Promise<PaginatedAffinityInteractionDto> {
    let params = `organization_id=${organizationId}&type=${type}&start_time=${start_time}&end_time=${end_time}`;
    if (page_size) {
      params = params.concat(`&page_size=${page_size}`);
    }
    if (page_token) {
      params = params.concat(`&page_token=${page_token}`);
    }

    return await this.httpService
      .get<PaginatedAffinityInteractionDto>(`/interactions?${params}`, {
        baseURL: this.baseURL,
        headers: this.headers,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }
}
