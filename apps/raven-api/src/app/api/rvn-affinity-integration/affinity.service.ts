import { Injectable } from '@nestjs/common';
import { environment } from '../../../environments/environment';
import { AffinitySettingsService } from './affinity-settings.service';
import { AffinityServiceLogger } from './affinity.service.logger';
import { AffinityApiService } from './api/affinity-api.service';
import { FieldValueChangeDto } from './api/dtos/field-value-change.dto';
import { FieldValueRankedDropdownDto } from './api/dtos/field-value-ranked-dropdown.dto';
import { ListEntryDto } from './api/dtos/list-entry.dto';
import { OrganizationDto } from './api/dtos/organization.dto';
import {
  WebhookPayloadDto,
  WebhookPayloadListEntryDto,
  WebhookPayloadOrganisationDto,
  WebhookPayloadPersonDto,
} from './api/dtos/webhook-payload.dto';
import { WebhookSubscriptions } from './api/dtos/webhook-subscriptions.dto';
import { AffinityCacheService } from './cache/affinity-cache.service';
import { OrganizationStageDto } from './dtos/organisation-stage.dto';

@Injectable()
export class AffinityService {
  public constructor(
    private readonly affinitySettingsService: AffinitySettingsService,
    private readonly affinityApiService: AffinityApiService,
    private readonly logger: AffinityServiceLogger,
    private readonly affinityCacheService: AffinityCacheService,
  ) {}
  public async regenerateAffinityData(): Promise<void> {
    this.logger.debug('Fetching for list and field from Affinity settings');
    const { defaultListId, statusFieldId } =
      this.affinitySettingsService.getListSettings();
    this.logger.debug(`List id: ${defaultListId}, field id: ${statusFieldId}`);
    const listDetails =
      await this.affinityApiService.getListDetails(defaultListId);
    if (!listDetails) {
      this.logger.error(`List with ID ${defaultListId} not found`);
      throw new Error(`List with ID ${defaultListId} not found`);
    }
    if (!listDetails.fields.some((field) => field.id === statusFieldId)) {
      this.logger.error(
        `Field with ID ${statusFieldId} not found in list ${defaultListId}`,
      );
      throw new Error(
        `Field with ID ${statusFieldId} not found in list ${defaultListId}`,
      );
    }

    this.logger.debug('Fetching all entries from Affinity');
    let pageToken: string | undefined;
    const allEntries: ListEntryDto[] = [];
    do {
      const entries = await this.affinityApiService.getListEntries(
        defaultListId,
        500,
        pageToken,
      );
      allEntries.push(...entries.list_entries);
      pageToken = entries.next_page_token;
    } while (pageToken);
    this.logger.debug(`Fetched ${allEntries.length} entries from Affinity`);

    this.logger.debug(
      'Fetching field value changes for status field from Affinity',
    );
    const fieldChanges =
      await this.affinityApiService.getFieldValueChanges(statusFieldId);
    this.logger.debug(
      `Fetched ${fieldChanges.length} field value changes from Affinity`,
    );

    const matchedData = this.matchFieldChangesWithEntries(
      allEntries,
      fieldChanges,
    );
    this.logger.debug(
      `Matched entries without field change: ${
        matchedData.filter((data) => !data.stage).length
      }`,
    );

    const requiredFields = [{ displayName: 'Deal Lead', mappedFrom: 'Owners' }];
    const fields = await this.affinityApiService.getFields(defaultListId);

    const mappedFields = requiredFields.map((requiredField) => {
      return {
        ...requiredField,
        field: fields.find((field) => field.name === requiredField.mappedFrom),
      };
    });
    for (const field of mappedFields) {
      const fieldValueChanges =
        await this.affinityApiService.getFieldValueChanges(field.field?.id);

      const distinctFieldValues = fieldValueChanges
        .sort((a, b) =>
          new Date(a.changed_at) > new Date(b.changed_at) ? 1 : -1,
        )
        .filter((obj, index) => {
          return (
            fieldValueChanges.findIndex(
              (item) => item.list_entry_id === obj.list_entry_id,
            ) === index
          );
        });
      for (const fieldValueChange of distinctFieldValues) {
        matchedData
          .find((data) => data.entryId === fieldValueChange.list_entry_id)
          .fields.push({
            displayName: field.displayName,
            value: fieldValueChange.value as string,
          });
      }
    }
    this.logger.debug('Reset data in cache');
    await this.affinityCacheService.reset();
    this.logger.debug('Done resetting');

    this.logger.debug('Storing data in cache');
    await this.affinityCacheService.addOrReplaceMany(matchedData);
    this.logger.debug('Stored data in cache');
  }

  public async handleWebhookPayload(body: WebhookPayloadDto): Promise<void> {
    switch ((typeof body).toString()) {
      case 'WebhookPayloadPersonDto': {
        const person = body as WebhookPayloadPersonDto;
        break;
      }
      case 'WebhookPayloadOrganizationDto': {
        const organization = body as WebhookPayloadOrganisationDto;
        break;
      }
      case 'WebhookPayloadListEntryDto': {
        const listEntry = body as WebhookPayloadListEntryDto;
        break;
      }
      default: {
        throw new Error(`Unknown webhook payload type: ${typeof body}`);
      }
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
        WebhookSubscriptions.ORGANIZATION_CREATED,
        WebhookSubscriptions.ORGANIZATION_UPDATED,
        WebhookSubscriptions.PERSON_CREATED,
        WebhookSubscriptions.PERSON_UPDATED,
        WebhookSubscriptions.LIST_ENTRY_CREATED,
      ],
    });
  }

  private matchFieldChangesWithEntries(
    entries: ListEntryDto[],
    fieldChanges: FieldValueChangeDto[],
  ): OrganizationStageDto[] {
    const matchedData: OrganizationStageDto[] = [];
    for (const entry of entries) {
      const fieldChange = fieldChanges.find(
        (change) => change.list_entry_id === entry.id,
      );

      matchedData.push({
        entryId: entry.id,
        organizationDto: entry.entity as OrganizationDto,
        stage: fieldChange?.value as FieldValueRankedDropdownDto,
        fields: [],
      });
    }

    return matchedData;
  }
}
