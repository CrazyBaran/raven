import {
  AffinityStatusChangedEvent,
  AffinityValueType,
} from '@app/rvns-affinity-integration';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { environment } from '../../../environments/environment';
import { GatewayEventService } from '../rvn-web-sockets/gateway/gateway-event.service';
import { AffinityValueResolverService } from './affinity-value-resolver.service';
import { AffinityWebhookServiceLogger } from './affinity-webhook-service.logger';
import { FIELD_MAPPING, STATUS_FIELD_NAME } from './affinity.const';
import { AffinityApiService } from './api/affinity-api.service';
import { ActionType } from './api/dtos/action-type.dto';
import { FieldValueChangeDto } from './api/dtos/field-value-change.dto';
import { FieldValueEntityDto } from './api/dtos/field-value-entity.dto';
import { FieldValueRankedDropdownDto } from './api/dtos/field-value-ranked-dropdown.dto';
import { OrganizationDto } from './api/dtos/organization.dto';
import { PersonDto } from './api/dtos/person.dto';
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
    private readonly gatewayEventService: GatewayEventService,
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
    const handledField = fields.find(
      (field) => field.id === payload.body.field_id,
    );
    const handledFieldName = handledField?.name;
    if (!HANDLED_FIELDS.includes(handledFieldName)) {
      this.logger.debug(`Field ${handledFieldName} is not handled, skipping`);
      return;
    }
    if (handledFieldName === STATUS_FIELD_NAME) {
      this.logger.debug(`Got matching field: ${handledFieldName}`);
      return await this.handleStatusFieldChange(payload);
    }
    if (
      handledField.value_type === AffinityValueType.Person &&
      handledField.allows_multiple
    ) {
      const companies = await this.affinityCacheService.getAll(
        (entry) => entry.entryId === payload.body.list_entry_id,
      );
      const company = companies[0];
      const cacheFieldName = FIELD_MAPPING.find(
        (fm) => fm.mappedFrom === handledFieldName,
      )?.displayName;
      const initialValue = company.fields.find(
        (field) => field.displayName === cacheFieldName,
      )?.value;
      const update = {
        ...payload.body,
        value: {
          id: payload.body.value,
        },
        action_type:
          (payload.body.action_type as unknown as string) ===
          'field_value.deleted'
            ? ActionType.Delete
            : ActionType.Create,
      };

      const finalValue = AffinityValueResolverService.resolveValue(
        handledField,
        [update as FieldValueChangeDto],
        initialValue,
      );
      const persons = [];
      for (const person of finalValue as FieldValueEntityDto[]) {
        if (!(person as PersonDto).first_name) {
          // we fetch for value as we have only id here
          const personEntity = await this.affinityApiService.getPerson(
            (person as PersonDto).id,
          );
          persons.push(personEntity);
        } else {
          persons.push(person);
        }
      }
      company.fields = [{ displayName: cacheFieldName, value: persons }];
      await this.affinityCacheService.addOrReplaceMany([company]);

      this.gatewayEventService.emit(`resource-pipelines`, {
        eventType: 'opportunity-field-changed',
        data: {
          companyId: company.entryId,
          fields: [{ displayName: cacheFieldName, value: persons }],
        },
      });
    }
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
