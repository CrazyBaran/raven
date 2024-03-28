import { InteractionsDto } from '@app/shared/affinity';
import { Injectable } from '@nestjs/common';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { AffinityInteractionMapper } from './affinity-interaction.mapper';
import { AffinitySettingsService } from './affinity-settings.service';
import { AffinityValueResolverService } from './affinity-value-resolver.service';
import { FIELD_MAPPING } from './affinity.const';
import { AffinityApiService } from './api/affinity-api.service';
import { AffinityFieldValueChangeDto } from './api/dtos/field-value-change.affinity.dto';
import { AffinityFieldValueRankedDropdownDto } from './api/dtos/field-value-ranked-dropdown.affinity.dto';
import { AffinityInteractionType } from './api/dtos/interaction.affinity.dto';
import { AffinityListEntryDto } from './api/dtos/list-entry.affinity.dto';
import {
  AffinityOrganizationBaseDto,
  AffinityOrganizationWithCrunchbaseDto,
} from './api/dtos/organization.affinity.dto';
import {
  PaginatedAffinityEmailInteractionsDto,
  PaginatedAffinityEventInteractionsDto,
  PaginatedAffinityInteractionDto,
} from './api/dtos/paginated-interaction.affinity.dto';
import { AffinityCacheService } from './cache/affinity-cache.service';
import { OrganizationStageDto } from './dtos/organisation-stage.dto';

@Injectable()
export class AffinityService {
  public constructor(
    private readonly affinitySettingsService: AffinitySettingsService,
    private readonly affinityApiService: AffinityApiService,
    private readonly logger: RavenLogger,
    private readonly affinityCacheService: AffinityCacheService,
    private readonly interactionMapper: AffinityInteractionMapper,
  ) {
    this.logger.setContext(AffinityService.name);
  }

  public async regenerateAffinityData(): Promise<void> {
    this.logger.debug('Fetching for list and field from Affinity settings');
    const { listId, statusFieldId } =
      await this.affinitySettingsService.getListSettings();
    this.logger.debug(`List id: ${listId}, field id: ${statusFieldId}`);
    const listDetails = await this.affinityApiService.getListDetails(listId);
    if (!listDetails) {
      this.logger.error(`List with ID ${listId} not found`);
      throw new Error(`List with ID ${listId} not found`);
    }
    if (!listDetails.fields.some((field) => field.id === statusFieldId)) {
      this.logger.error(
        `Field with ID ${statusFieldId} not found in list ${listId}`,
      );
      throw new Error(
        `Field with ID ${statusFieldId} not found in list ${listId}`,
      );
    }

    await this.affinityCacheService.setListFields(listDetails.fields);

    this.logger.debug('Fetching all organizations from Affinity');
    const organizations = await this.getAllOrganizations();

    this.logger.debug('Fetching all entries from Affinity');
    const listEntries = await this.getListEntries(listId);
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

    const fields = await this.affinityApiService.getFields(listId);

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
        [key: string]: AffinityFieldValueChangeDto[];
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

  public async getLatestInteraction(options: {
    domains?: string[];
    organizationIds?: number[];
  }): Promise<Date> {
    let organisationIds = options.organizationIds;

    if (
      (!organisationIds || organisationIds.length === 0) &&
      options.domains &&
      options.domains.length > 0
    ) {
      const organisations = await this.affinityCacheService.getByDomains(
        options.domains,
      );
      if (!organisations || organisations.length === 0) {
        return null;
      }

      organisationIds = organisations.map((org) => org.organizationDto.id);
    }

    let latestInteraction: Date = null;

    for (const organisationId of organisationIds) {
      const emailResponse = await this.affinityApiService.getInteractions(
        organisationId,
        AffinityInteractionType.Email,
        new Date(
          new Date().setFullYear(new Date().getFullYear() - 10),
        ).toISOString(),
        new Date().toISOString(),
        1,
      );

      const emailDate =
        (emailResponse as PaginatedAffinityEmailInteractionsDto).emails.length >
        0
          ? new Date(
              (
                emailResponse as PaginatedAffinityEmailInteractionsDto
              ).emails[0].date,
            )
          : null;

      if (emailDate && (!latestInteraction || emailDate > latestInteraction)) {
        latestInteraction = emailDate;
      }

      const meetingResponse = await this.affinityApiService.getInteractions(
        organisationId,
        AffinityInteractionType.Meeting,
        new Date(
          new Date().setFullYear(new Date().getFullYear() - 10),
        ).toISOString(),
        new Date().toISOString(),
        1,
      );

      const meetingDate =
        (meetingResponse as PaginatedAffinityEventInteractionsDto).events
          .length > 0
          ? new Date(
              (
                meetingResponse as PaginatedAffinityEventInteractionsDto
              ).events[0].date,
            )
          : null;

      if (
        meetingDate &&
        (!latestInteraction || meetingDate > latestInteraction)
      ) {
        latestInteraction = meetingDate;
      }
    }

    return latestInteraction;
  }

  public async getInteractions(options: {
    domains?: string[];
    organizationIds?: number[];
    startDate?: Date;
    endDate?: Date;
  }): Promise<Partial<InteractionsDto>> {
    let organisationIds = options.organizationIds;

    if (
      (!organisationIds || organisationIds.length === 0) &&
      options.domains &&
      options.domains.length > 0
    ) {
      const organisations = await this.affinityCacheService.getByDomains(
        options.domains,
      );
      if (!organisations || organisations.length === 0) {
        return {};
      }

      organisationIds = organisations.map((org) => org.organizationDto.id);
    }

    const interactions: Partial<InteractionsDto> = {
      items: [],
    };

    for (const organisationId of organisationIds) {
      let response: PaginatedAffinityInteractionDto = undefined;
      do {
        response = await this.affinityApiService.getInteractions(
          organisationId,
          AffinityInteractionType.Email,
          options.startDate?.toISOString(),
          options.endDate?.toISOString(),
          500,
        );
        interactions.items.push(
          ...this.interactionMapper.mapEmails(
            (response as PaginatedAffinityEmailInteractionsDto).emails,
          ),
        );
      } while (response.next_page_token);
      do {
        response = await this.affinityApiService.getInteractions(
          organisationId,
          AffinityInteractionType.Meeting,
          options.startDate?.toISOString(),
          options.endDate?.toISOString(),
          500,
        );
        interactions.items.push(
          ...this.interactionMapper.mapMeetings(
            (response as PaginatedAffinityEventInteractionsDto).events,
          ),
        );
      } while (response.next_page_token);
    }

    return interactions;
  }

  private matchListEntriesWithStages(
    organizations: AffinityOrganizationWithCrunchbaseDto[],
    entries: AffinityListEntryDto[],
    fieldChanges: AffinityFieldValueChangeDto[],
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
        organizationDto: organization as AffinityOrganizationBaseDto,
        stage: latestFieldChange?.value as AffinityFieldValueRankedDropdownDto,
        fields: [],
      });
    }

    return matchedData;
  }

  private async getAllOrganizations(): Promise<
    AffinityOrganizationWithCrunchbaseDto[]
  > {
    let pageToken: string | undefined;
    const allOrganizations: AffinityOrganizationWithCrunchbaseDto[] = [];
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

  private async getListEntries(
    defaultListId: number,
  ): Promise<AffinityListEntryDto[]> {
    let pageToken: string | undefined;
    const allEntries: AffinityListEntryDto[] = [];
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
