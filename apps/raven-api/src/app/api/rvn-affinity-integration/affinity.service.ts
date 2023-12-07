import { Injectable } from '@nestjs/common';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { AffinitySettingsService } from './affinity-settings.service';
import { AffinityValueResolverService } from './affinity-value-resolver.service';
import { FIELD_MAPPING } from './affinity.const';
import { AffinityApiService } from './api/affinity-api.service';
import { FieldValueChangeDto } from './api/dtos/field-value-change.dto';
import { FieldValueRankedDropdownDto } from './api/dtos/field-value-ranked-dropdown.dto';
import { ListEntryDto } from './api/dtos/list-entry.dto';
import {
  OrganizationBaseDto,
  OrganizationWithCrunchbaseDto,
} from './api/dtos/organization.dto';
import { AffinityCacheService } from './cache/affinity-cache.service';
import { OrganizationStageDto } from './dtos/organisation-stage.dto';

@Injectable()
export class AffinityService {
  public constructor(
    private readonly affinitySettingsService: AffinitySettingsService,
    private readonly affinityApiService: AffinityApiService,
    private readonly logger: RavenLogger,
    private readonly affinityCacheService: AffinityCacheService,
  ) {
    this.logger.setContext(AffinityService.name);
  }

  public async regenerateAffinityData(): Promise<void> {
    this.logger.debug('Fetching for list and field from Affinity settings');
    const { defaultListId, statusFieldId } =
      await this.affinitySettingsService.getListSettings();
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

    await this.affinityCacheService.setListFields(listDetails.fields);

    this.logger.debug('Fetching all organizations from Affinity');
    const organizations = await this.getAllOrganizations();

    this.logger.debug('Fetching all entries from Affinity');
    const listEntries = await this.getListEntries(defaultListId);
    this.logger.debug(`Fetched ${listEntries.length} entries from Affinity`);

    this.logger.debug(
      'Fetching field value changes for status field from Affinity',
    );
    const fieldChanges =
      await this.affinityApiService.getFieldValueChanges(statusFieldId);
    this.logger.debug(
      `Fetched ${fieldChanges.length} field value changes from Affinity`,
    );

    const matchedData = this.matchListEntriesWithStages(
      organizations,
      listEntries,
      fieldChanges,
    );
    this.logger.debug(
      `Matched entries without field change: ${
        matchedData.filter((data) => !data.stage).length
      }`,
    );

    const fields = await this.affinityApiService.getFields(defaultListId);

    const mappedFields = FIELD_MAPPING.map((requiredField) => {
      return {
        ...requiredField,
        field: fields.find((field) => field.name === requiredField.mappedFrom),
      };
    });
    for (const field of mappedFields) {
      const fieldValueChanges =
        await this.affinityApiService.getFieldValueChanges(field.field?.id);

      const fieldValueChangesByEntryId: {
        [key: string]: FieldValueChangeDto[];
      } = fieldValueChanges.reduce((acc, change) => {
        if (!acc[change.list_entry_id]) {
          acc[change.list_entry_id] = [];
        }
        acc[change.list_entry_id].push(change);
        return acc;
      }, {});
      for (const [entryIdKey, fieldValueChanges] of Object.entries(
        fieldValueChangesByEntryId,
      )) {
        if (fieldValueChanges?.length !== 0) {
          const finalValue = AffinityValueResolverService.resolveValue(
            field.field,
            fieldValueChanges.sort(
              (a, b) =>
                new Date(a.changed_at).getTime() -
                new Date(b.changed_at).getTime(),
            ),
          );
          const matchingEntry = matchedData.find(
            (data) => data?.entityId?.toString() === entryIdKey,
          );

          if (matchingEntry)
            matchingEntry.fields.push({
              displayName: field.displayName,
              value: finalValue,
            });
        }
      }
    }
    this.logger.debug('Reset data in cache');
    await this.affinityCacheService.reset();
    this.logger.debug('Done resetting');

    this.logger.debug('Storing data in cache');
    await this.affinityCacheService.addOrReplaceMany(matchedData);
    this.logger.debug('Stored data in cache');
  }

  private matchListEntriesWithStages(
    organizations: OrganizationWithCrunchbaseDto[],
    entries: ListEntryDto[],
    fieldChanges: FieldValueChangeDto[],
  ): OrganizationStageDto[] {
    const matchedData: OrganizationStageDto[] = [];
    for (const organization of organizations) {
      const matchedFieldChanges = fieldChanges.filter(
        (change) => change.entity_id === organization.id,
      );

      const latestFieldChange = matchedFieldChanges.sort(
        (a, b) =>
          new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime(),
      )[0];

      const matchingEntry = entries.find(
        (entry) => entry.entity_id === organization.id,
      );

      matchedData.push({
        entityId: organization.id,
        listEntryId: matchingEntry?.id,
        entryAdded: matchingEntry ? new Date(matchingEntry.created_at) : null,
        organizationDto: organization as OrganizationBaseDto,
        stage: latestFieldChange?.value as FieldValueRankedDropdownDto,
        fields: [],
      });
    }

    return matchedData;
  }

  private async getAllOrganizations(): Promise<
    OrganizationWithCrunchbaseDto[]
  > {
    let pageToken: string | undefined;
    const allOrganizations: OrganizationWithCrunchbaseDto[] = [];
    do {
      const organizations = await this.affinityApiService.getOrganizations(
        500,
        pageToken,
      );
      allOrganizations.push(...organizations.organizations);
      pageToken = organizations.next_page_token;
    } while (pageToken);
    return allOrganizations;
  }

  private async getListEntries(defaultListId: number): Promise<ListEntryDto[]> {
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
    return allEntries;
  }
}
