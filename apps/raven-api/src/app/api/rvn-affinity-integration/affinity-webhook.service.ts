import { AffinityStatusChangedEvent } from '@app/rvns-affinity-integration';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { environment } from '../../../environments/environment';
import { AffinityWebhookServiceLogger } from './affinity-webhook-service.logger';
import { STATUS_FIELD_NAME } from './affinity.const';
import { AffinityApiService } from './api/affinity-api.service';
import { FieldValueRankedDropdownDto } from './api/dtos/field-value-ranked-dropdown.dto';
import { OrganizationDto } from './api/dtos/organization.dto';
import {
  WebhookPayloadDto,
  WebhookPayloadFieldValueDto,
  WebhookPayloadListEntryDto,
} from './api/dtos/webhook-payload.dto';
import { WebhookSubscriptions } from './api/dtos/webhook-subscriptions.dto';
import { AffinityCacheService } from './cache/affinity-cache.service';
import { OrganizationStageDto } from './dtos/organisation-stage.dto';

const HANDLED_FIELDS = [STATUS_FIELD_NAME, 'Owners'];

@Injectable()
export class AffinityWebhookService {
  public constructor(
    private readonly affinityApiService: AffinityApiService,
    private readonly logger: AffinityWebhookServiceLogger,
    private readonly affinityCacheService: AffinityCacheService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async handleWebhookPayload(payload: WebhookPayloadDto): Promise<void> {
    switch (payload.type) {
      case WebhookSubscriptions.LIST_ENTRY_CREATED:
        this.logger.debug('Handling list entry created');
        await this.handleListEntryCreated(payload);
        break;
      case WebhookSubscriptions.FIELD_VALUE_CREATED:
      case WebhookSubscriptions.FIELD_VALUE_DELETED:
      case WebhookSubscriptions.FIELD_VALUE_UPDATED:
        this.logger.debug('Handling field value change');
        await this.handleFieldValueUpdated(payload);
        break;
    }
  }

  public async setupWebhook(): Promise<void> {
    const subscriptions = await this.affinityApiService.getWebhooks();
    if (
      subscriptions
        .map((subscription) => {
          return subscription.webhook_url;
        })
        .includes(
          `${environment.app.apiUrl}/affinity/webhook?token=${environment.affinity.webhookToken}`,
        )
    ) {
      this.logger.debug('Webhook already exists, skipping setup');
      return;
    }

    const webhook = await this.affinityApiService.subscribeWebhook({
      webhook_url: `${environment.app.apiUrl}/affinity/webhook?token=${environment.affinity.webhookToken}`,
      subscriptions: [
        WebhookSubscriptions.LIST_ENTRY_CREATED,
        WebhookSubscriptions.FIELD_VALUE_CREATED,
        WebhookSubscriptions.FIELD_VALUE_DELETED,
        WebhookSubscriptions.FIELD_VALUE_UPDATED,
      ],
    });
  }

  private async handleListEntryCreated(
    payload: WebhookPayloadListEntryDto,
  ): Promise<void> {
    const companyEntity = payload.body.entity as OrganizationDto;
    const companyData: OrganizationStageDto = {
      entryId: payload.body.id,
      entryAdded: new Date(payload.body.created_at),
      organizationDto: companyEntity,
      fields: [],
    };
    await this.affinityCacheService.addOrReplaceMany([companyData]);
  }

  private async handleFieldValueUpdated(
    payload: WebhookPayloadFieldValueDto,
  ): Promise<void> {
    const fields = await this.affinityCacheService.getListFields();
    const handledFieldName = fields.find(
      (field) => field.id === payload.body.field_id,
    )?.name;
    if (!HANDLED_FIELDS.includes(handledFieldName)) {
      this.logger.debug(`Field ${handledFieldName} is not handled, skipping`);
      return;
    }
    if (handledFieldName === STATUS_FIELD_NAME) {
      this.logger.debug(`Got matching field: ${handledFieldName}`);
      return await this.handleStatusFieldChange(payload);
    }
    // TODO handle other fields
  }

  private async handleStatusFieldChange(
    payload: WebhookPayloadFieldValueDto,
  ): Promise<void> {
    const companies = await this.affinityCacheService.getAll(
      (entry) => entry.entryId === payload.body.list_entry_id,
    );
    if (!companies || companies.length === 0) {
      this.logger.warn(
        `Could not find company in cache with entry id: ${payload.body.list_entry_id}`,
      );
      return;
    }
    const company = companies[0];
    const value = payload.body.value as FieldValueRankedDropdownDto;
    company.stage = value;
    await this.affinityCacheService.addOrReplaceMany([company]);
    this.logger.debug('Emitting affinity status changed event');
    this.eventEmitter.emit(
      'affinity-status-changed',
      new AffinityStatusChangedEvent(
        company.organizationDto.domains,
        value.text,
      ),
    );
  }
}
