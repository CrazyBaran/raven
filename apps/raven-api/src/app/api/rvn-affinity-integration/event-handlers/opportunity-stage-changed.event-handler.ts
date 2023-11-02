import { OpportunityStageChangedEvent } from '@app/rvns-opportunities';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AffinitySettingsService } from '../affinity-settings.service';
import { STATUS_FIELD_NAME } from '../affinity.const';
import { AffinityApiService } from '../api/affinity-api.service';
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

    const { defaultListId, statusFieldId } =
      this.affinitySettingsService.getListSettings();

    const listFields = await this.affinityCacheService.getListFields();
    if (!listFields.some((field) => field.name === STATUS_FIELD_NAME)) {
      throw new Error(
        `Incorrect Affinity configuration - cannot find field with name ${STATUS_FIELD_NAME}`,
      );
    }
    const stageOptions = listFields.find(
      (field) => field.name === STATUS_FIELD_NAME,
    )?.dropdown_options;

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

    const statusValue = fieldValues.find(
      (fieldValue) => fieldValue.field_id === statusFieldId,
    );

    await this.affinityApiService.updateFieldValue(statusValue.id, {
      value: stageOption.id,
    });

    company.stage = stageOption;
    await this.affinityCacheService.addOrReplaceMany([company]);
  }
}
