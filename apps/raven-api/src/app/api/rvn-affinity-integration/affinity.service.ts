import { Injectable } from '@nestjs/common';
import { AffinitySettingsService } from './affinity-settings.service';
import { AffinityServiceLogger } from './affinity.service.logger';
import { AffinityApiService } from './api/affinity-api.service';
import { FieldValueChangeDto } from './api/dtos/field-value-change.dto';
import { FieldValueRankedDropdownDto } from './api/dtos/field-value-ranked-dropdown.dto';
import { ListEntryResponseDto } from './api/dtos/list-entry-response.dto';
import { OrganizationDto } from './api/dtos/organization.dto';
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
    const { list_id, field_id } =
      await this.affinitySettingsService.getListSettings();
    this.logger.debug(`List id: ${list_id}, field id: ${field_id}`);
    const listDetails = await this.affinityApiService.getListDetails(list_id);
    if (!listDetails) {
      this.logger.error(`List with ID ${list_id} not found`);
      throw new Error(`List with ID ${list_id} not found`);
    }
    if (!listDetails.fields.some((field) => field.id === field_id)) {
      this.logger.error(
        `Field with ID ${field_id} not found in list ${list_id}`,
      );
      throw new Error(`Field with ID ${field_id} not found in list ${list_id}`);
    }

    this.logger.debug('Fetching all entries from Affinity');
    let pageToken: string | undefined;
    const allEntries: ListEntryResponseDto[] = [];
    do {
      const entries = await this.affinityApiService.getListEntries(
        list_id,
        500,
        pageToken,
      );
      allEntries.push(...entries.list_entries);
      pageToken = entries.next_page_token;
    } while (pageToken);
    this.logger.debug(`Fetched ${allEntries.length} entries from Affinity`);

    this.logger.debug('Fetching field value changes from Affinity');
    const fieldChanges =
      await this.affinityApiService.getFieldValueChanges(field_id);
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

    this.logger.debug('Storing data in cache');
    await this.affinityCacheService.addOrReplaceMany(matchedData);
    this.logger.debug('Stored data in cache');
  }

  private matchFieldChangesWithEntries(
    entries: ListEntryResponseDto[],
    fieldChanges: FieldValueChangeDto[],
  ): OrganizationStageDto[] {
    const matchedData: OrganizationStageDto[] = [];
    for (const entry of entries) {
      const fieldChange = fieldChanges.find(
        (change) => change.list_entry_id === entry.id,
      );

      matchedData.push({
        organizationDto: entry.entity as OrganizationDto,
        stage: fieldChange?.value as FieldValueRankedDropdownDto,
      });
    }

    return matchedData;
  }
}
