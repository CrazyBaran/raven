import {
  AffinityOrganizationCreatedEvent,
  AffinityStatusChangedEvent,
  AffinityValueType,
} from '@app/rvns-affinity-integration';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { environment } from '../../../environments/environment';

import { AffinitySettingsService } from './affinity-settings.service';

import { AffinityFieldChangedEvent } from '@app/rvns-affinity-integration';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { AffinityValueResolverService } from './affinity-value-resolver.service';
import { FIELD_MAPPING, STATUS_FIELD_NAME } from './affinity.const';
import { AffinityApiService } from './api/affinity-api.service';
import { AffinityActionType } from './api/dtos/action-type.affinity.dto';
import { AffinityFieldValueChangeDto } from './api/dtos/field-value-change.affinity.dto';
import { AffinityFieldValueEntityDto } from './api/dtos/field-value-entity.affinity.dto';
import { AffinityFieldValueRankedDropdownDto } from './api/dtos/field-value-ranked-dropdown.affinity.dto';
import {
  AffinityOrganizationBaseDto,
  AffinityOrganizationDto,
} from './api/dtos/organization.affinity.dto';
import { AffinityPersonDto } from './api/dtos/person.affinity.dto';
import {
  AffinityWebhookPayloadDto,
  AffinityWebhookPayloadFieldValueDto,
  AffinityWebhookPayloadListEntryDto,
  AffinityWebhookPayloadOrganisationDto,
} from './api/dtos/webhook-payload.affinity.dto';
import { AffinityWebhookSubscriptions } from './api/dtos/webhook-subscriptions.affinity.dto';
import { AffinityCacheService } from './cache/affinity-cache.service';
import { OrganizationStageDto } from './dtos/organisation-stage.dto';

const HANDLED_FIELDS = [STATUS_FIELD_NAME, 'Owners'];

@Injectable()
export class AffinityWebhookService {
  public constructor(
    private readonly affinityApiService: AffinityApiService,
    private readonly affinitySettingsService: AffinitySettingsService,
    private readonly logger: RavenLogger,
    private readonly affinityCacheService: AffinityCacheService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.logger.setContext(AffinityWebhookService.name);
  }

  public async handleWebhookPayload(
    payload: AffinityWebhookPayloadDto,
  ): Promise<void> {
    switch (payload.type) {
      case AffinityWebhookSubscriptions.LIST_ENTRY_CREATED:
        this.logger.debug('Handling list entry created');
        await this.handleListEntryCreated(payload);
        break;
      case AffinityWebhookSubscriptions.FIELD_VALUE_CREATED:
      case AffinityWebhookSubscriptions.FIELD_VALUE_DELETED:
      case AffinityWebhookSubscriptions.FIELD_VALUE_UPDATED:
        this.logger.debug('Handling field value change');
        await this.handleFieldValueUpdated(payload);
        break;
      case AffinityWebhookSubscriptions.ORGANIZATION_CREATED:
      case AffinityWebhookSubscriptions.ORGANIZATION_UPDATED:
        this.logger.debug('Handling organization created');
        await this.handleOrganizationCreated(payload);
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
        AffinityWebhookSubscriptions.LIST_ENTRY_CREATED,
        AffinityWebhookSubscriptions.FIELD_VALUE_CREATED,
        AffinityWebhookSubscriptions.FIELD_VALUE_DELETED,
        AffinityWebhookSubscriptions.FIELD_VALUE_UPDATED,
      ],
    });
  }

  private async handleListEntryCreated(
    payload: AffinityWebhookPayloadListEntryDto,
  ): Promise<void> {
    this.logger.log(
      `Handling list entry created: entity_id: ${payload.body.entity_id}`,
    );
    this.logger.log({ payloadBody: payload.body });
    const organizationDto = payload.body.entity as AffinityOrganizationDto;
    const organizationData: OrganizationStageDto = {
      entityId: payload.body.entity_id,
      listEntryId: payload.body.id,
      entryAdded: new Date(payload.body.created_at),
      organizationDto: organizationDto,
      stage: undefined,
      fields: [],
    };

    const statusFieldId = (await this.affinitySettingsService.getListSettings())
      .statusFieldId;

    const fieldValues = await this.affinityApiService.getFieldValues(
      payload.body.id,
    );

    const statusField = fieldValues.find((fieldValue) => {
      return fieldValue.field_id === statusFieldId;
    }).value as AffinityFieldValueRankedDropdownDto;

    this.logger.log({ statusField, entity_id: payload.body.entity_id });

    organizationData.stage = statusField;

    await this.affinityCacheService.addOrReplaceMany([organizationData]);
    this.eventEmitter.emit(
      'affinity-organization-created',
      new AffinityOrganizationCreatedEvent(
        organizationDto.name,
        organizationDto.domains,
        environment.opportunitySync.enabledOnWebhook,
      ),
    );
  }

  private async handleOrganizationCreated(
    payload: AffinityWebhookPayloadOrganisationDto,
  ): Promise<void> {
    this.logger.log(
      `Handling organisation created: domain: ${payload.body.domain}`,
    );
    const organizationDto = payload.body as AffinityOrganizationBaseDto;
    const organizationData: OrganizationStageDto = {
      entityId: payload.body.id,
      listEntryId: null,
      entryAdded: null,
      organizationDto: organizationDto,
      stage: undefined,
      fields: [],
    };

    const statusFieldId = (await this.affinitySettingsService.getListSettings())
      .statusFieldId;

    const fieldValues = await this.affinityApiService.getFieldValues(
      payload.body.id,
    );

    const statusField = fieldValues.find((fieldValue) => {
      return fieldValue.field_id === statusFieldId;
    }).value as AffinityFieldValueRankedDropdownDto;

    this.logger.log({ statusField, domain: payload.body.domain });

    organizationData.stage = statusField;

    await this.affinityCacheService.addOrReplaceMany([organizationData]);
    this.eventEmitter.emit(
      'affinity-organization-created',
      new AffinityOrganizationCreatedEvent(
        organizationDto.name,
        organizationDto.domains,
        false,
      ),
    );
  }

  private async handleFieldValueUpdated(
    payload: AffinityWebhookPayloadFieldValueDto,
  ): Promise<void> {
    this.logger.log(
      `Handling field value updated: entity_id: ${payload.body.entity_id}`,
    );
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
        (entry) => entry.entityId === payload.body.list_entry_id,
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
            ? AffinityActionType.Delete
            : AffinityActionType.Create,
      };

      const finalValue = AffinityValueResolverService.resolveValue(
        handledField,
        [update as AffinityFieldValueChangeDto],
        initialValue,
      );
      const persons = [];
      for (const person of finalValue as AffinityFieldValueEntityDto[]) {
        if (!(person as AffinityPersonDto).first_name) {
          // we fetch for value as we have only id here
          const personEntity = await this.affinityApiService.getPerson(
            (person as AffinityPersonDto).id,
          );
          persons.push(personEntity);
        } else {
          persons.push(person);
        }
      }
      company.fields = [{ displayName: cacheFieldName, value: persons }];
      await this.affinityCacheService.addOrReplaceMany([company]);

      this.eventEmitter.emit(
        'affinity-field-changed',
        new AffinityFieldChangedEvent(company.organizationDto.domains, [
          { displayName: cacheFieldName, value: persons },
        ]),
      );
    }
  }

  private async handleStatusFieldChange(
    payload: AffinityWebhookPayloadFieldValueDto,
  ): Promise<void> {
    this.logger.log(
      `Handling status field change: entity_id: ${payload.body.entity_id}`,
    );
    this.logger.log({ payloadBody: payload.body });
    const companies = await this.affinityCacheService.getAll(
      (entry) => entry.listEntryId === payload.body.list_entry_id,
    );
    if (!companies || companies.length === 0) {
      this.logger.warn(
        `Could not find company in cache with entry id: ${payload.body.list_entry_id}`,
      );
      return;
    }
    const company = companies[0];
    const value = payload.body.value as AffinityFieldValueRankedDropdownDto;
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
