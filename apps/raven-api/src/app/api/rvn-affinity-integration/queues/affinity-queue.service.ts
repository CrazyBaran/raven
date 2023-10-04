import { Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { AffinitySettingsService } from '../affinity-settings.service';
import { AffinityApiService } from '../affinity-api.service';
import { AFFINITY_CACHE, AFFINITY_QUEUE } from './affinity-queue.const';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ListEntryResponseDto } from '../dtos/api/list-entry-response.dto';
import { FieldValueChangeDto } from '../dtos/api/field-value-change.dto';
import { OrganizationStageDto } from '../dtos/organisation-stage.dto';
import { OrganizationDto } from '../dtos/api/organization.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class AffinityQueueService {
  public constructor(
    @InjectQueue(AFFINITY_QUEUE) private readonly affinityQueue: Queue,
    private readonly affinitySettingsService: AffinitySettingsService,
    private readonly affinityService: AffinityApiService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  public async regenerateAffinityData(): Promise<void> {
    const { list_id, field_id } =
      await this.affinitySettingsService.getListSettings();

    const listDetails = await this.affinityService.getListDetails(list_id);
    if (!listDetails) {
      throw new Error(`List with id ${list_id} not found`);
    }
    if (!listDetails.fields.some((field) => field.id === field_id)) {
      throw new Error(`Field with id ${field_id} not found in list ${list_id}`);
    }

    let pageToken: string | undefined;
    const allEntries: ListEntryResponseDto[] = [];
    do {
      const entries = await this.affinityService.getListEntries(
        list_id,
        500,
        pageToken,
      );
      allEntries.push(...entries.list_entries);
      pageToken = entries.next_page_token;
    } while (pageToken);

    const fieldChanges =
      await this.affinityService.getFieldValueChanges(field_id);
    const matchedData = this.matchFieldChangesWithEntries(
      allEntries,
      fieldChanges,
    );
    await this.storeInCache(matchedData);
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
        stage: fieldChange?.value,
      });
    }

    return matchedData;
  }

  private async storeInCache(data: OrganizationStageDto[]): Promise<void> {
    for (const entry of data) {
      const key = `${AFFINITY_CACHE}::${entry.organizationDto.id}`;
      await this.cacheManager.set(key, entry);
    }
  }
}
