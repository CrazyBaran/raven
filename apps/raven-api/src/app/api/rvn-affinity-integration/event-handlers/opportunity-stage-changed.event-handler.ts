import { OpportunityStageChangedEvent } from '@app/rvns-opportunities';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AffinitySettingsService } from '../affinity-settings.service';
import { AffinityApiService } from '../api/affinity-api.service';
import { DropdownOptionDto } from '../api/dtos/dropdown-option.dto';
import { AffinityCacheService } from '../cache/affinity-cache.service';
import { OrganizationStageDto } from '../dtos/organisation-stage.dto';

@Injectable()
export class OpportunityStageChangedEventHandler {
  public constructor(
    private readonly affinityApiService: AffinityApiService,
    private readonly affinitySettingsService: AffinitySettingsService,
    private readonly affinityCacheService: AffinityCacheService,
  ) {}

  @OnEvent('opportunity-stage-changed')
  protected async process(event: OpportunityStageChangedEvent): Promise<void> {
    const company = await this.getOrCreateCompany(
      event.organisationName,
      event.organisationDomains,
    );

    const { listId, statusFieldId } =
      await this.affinitySettingsService.getListSettings();

    const stage = await this.getStage(
      listId,
      statusFieldId,
      event.targetPipelineMappedFrom,
    );

    const isOnTheList = await this.isOnTheList(company, listId);
    if (!isOnTheList) {
      await this.addCompanyToList(company, listId);
    }
    await this.updateCompanyStatus(company, statusFieldId, stage);
  }

  private async getOrCreateCompany(
    name: string,
    domains: string[],
  ): Promise<OrganizationStageDto> {
    const companies = await this.affinityCacheService.getByDomains(domains);
    if (!companies || companies.length === 0) {
      return await this.createAffinityCompany(name, domains);
    }
    // TODO: handle multiple companies with the same domain
    const company = companies[0];
    return company;
  }

  private async createAffinityCompany(
    name: string,
    domains: string[],
  ): Promise<OrganizationStageDto> {
    const company = await this.affinityApiService.createOrganization(
      name,
      domains[0],
    );
    const companyWithStage = {
      organizationDto: company,
      stage: null,
      fields: [],
      entityId: null,
      listEntryId: null,
      entryAdded: null,
    } as OrganizationStageDto;
    await this.affinityCacheService.addOrReplaceMany([companyWithStage]);
    return companyWithStage;
  }

  private async isOnTheList(
    company: OrganizationStageDto,
    listId: number,
  ): Promise<boolean> {
    return company.stage !== null;
  }

  private async addCompanyToList(
    company: OrganizationStageDto,
    listId: number,
  ): Promise<void> {
    const listEntry = await this.affinityApiService.createListEntry(
      listId,
      company.organizationDto.id,
    );
  }

  private async updateCompanyStatus(
    company: OrganizationStageDto,
    statusFieldId: number,
    stage: DropdownOptionDto,
  ): Promise<void> {
    const fieldValues = await this.affinityApiService.getFieldValues(
      company.listEntryId,
    );

    const statusValue = fieldValues.find(
      (fieldValue) => fieldValue.field_id === statusFieldId,
    );

    await this.affinityApiService.updateFieldValue(statusValue.id, {
      value: stage.id,
    });

    company.stage = stage;
    await this.affinityCacheService.addOrReplaceMany([company]);
  }

  private async getStage(
    listId: number,
    statusFieldId: number,
    stage: string,
  ): Promise<DropdownOptionDto> {
    const listFields = await this.affinityCacheService.getListFields();
    const statusField = listFields.find((field) => field.id === statusFieldId);
    if (!statusField) {
      throw new Error(
        `Incorrect Affinity configuration or cache issue - cannot find field with id ${statusFieldId}`,
      );
    }

    const stageOption = statusField.dropdown_options.find(
      (option) => option.text === stage,
    );
    if (!stageOption) {
      throw new Error(
        `Incorrect Affinity configuration or pipeline definition - cannot find stage option with text ${stage}`,
      );
    }
    return stageOption;
  }
}
