import { OpportunityStageChangedEvent } from '@app/rvns-opportunities';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AffinitySettingsService } from '../affinity-settings.service';
import { AffinityApiService } from '../api/affinity-api.service';
import { FieldValueRankedDropdownDto } from '../api/dtos/field-value-ranked-dropdown.dto';
import { AffinityCacheService } from '../cache/affinity-cache.service';

@Injectable()
export class OpportunityStageChangedEventHandler {
  public constructor(
    private readonly affinityApiService: AffinityApiService,
    private readonly affinitySettingsService: AffinitySettingsService,
    private readonly affinityCacheService: AffinityCacheService,
  ) {}

  @OnEvent('opportunity-stage-changed')
  protected async process(event: OpportunityStageChangedEvent): Promise<void> {
    const company = await this.affinityCacheService.getByDomains(
      event.organisationDomains,
    );
    if (!company) {
      // if there is no company in cache, we can't update it in Affinity, so we return early
      return;
    }

    // TODO maybe we can store stage options in cache as well? - recreated at app start?
    const { defaultListId, statusFieldId } =
      this.affinitySettingsService.getListSettings();
    const listDetails =
      await this.affinityApiService.getListDetails(defaultListId);

    if (
      !listDetails ||
      !listDetails.fields.some((field) => field.id === statusFieldId)
    ) {
      throw new Error(
        `Incorrect Affinity configuration - cannot find list with ID ${defaultListId} or field with ID ${statusFieldId}`,
      );
    }

    const stageOptions = listDetails.fields.find(
      (field) => field.id === statusFieldId,
    ).dropdown_options as FieldValueRankedDropdownDto[];

    const stageOption = stageOptions.find(
      (option) => option.text === event.targetPipelineMappedFrom,
    );
    if (!stageOption) {
      throw new Error(
        `Incorrect Affinity configuration - cannot find stage option with text ${event.targetPipelineMappedFrom}`,
      );
    }

    const fieldValues = await this.affinityApiService.getFieldValues(
      company.entryId,
    );

    console.log({ fieldValues });

    const statusValue = fieldValues.find(
      (fieldValue) => fieldValue.field_id === statusFieldId,
    );

    const changedField = await this.affinityApiService.updateFieldValue(
      statusValue.id,
      {
        value: stageOption.id,
      },
    );

    // TODO consider updating stageFieldId in cache each time here, and on webhook change
    console.log({ changedField });

    company.stage = stageOption;
    await this.affinityCacheService.addOrReplaceMany([company]);
  }
}
