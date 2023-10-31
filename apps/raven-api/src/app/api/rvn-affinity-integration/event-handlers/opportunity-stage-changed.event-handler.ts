import { OpportunityStageChangedEvent } from '@app/rvns-opportunities';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AffinitySettingsService } from '../affinity-settings.service';
import { AffinityApiService } from '../api/affinity-api.service';
import { FieldValueRankedDropdownDto } from '../api/dtos/field-value-ranked-dropdown.dto';

@Injectable()
export class OpportunityStageChangedEventHandler {
  public constructor(
    private readonly affinityApiService: AffinityApiService,
    private readonly affinitySettingsService: AffinitySettingsService,
  ) {}

  @OnEvent('opportunity-stage-changed')
  protected async process(event: OpportunityStageChangedEvent): Promise<void> {
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
    // TODO find in cache company with given domains joined by coma, find field_id to update (this must be held in cache - to be changed)
    // await this.affinityApiService.updateFieldValue();
  }
}
