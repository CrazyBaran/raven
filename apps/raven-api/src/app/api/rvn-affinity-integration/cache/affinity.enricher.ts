import {
  OpportunityData,
  OpportunityDataWithoutOrganisation,
  OrganisationData,
  OrganisationDataWithOpportunities,
} from '@app/rvns-opportunities';
import { Injectable } from '@nestjs/common';
import { environment } from '../../../../environments/environment';
import { OpportunityEntity } from '../../rvn-opportunities/entities/opportunity.entity';
import { OrganisationEntity } from '../../rvn-opportunities/entities/organisation.entity';
import { OrganizationStageDto } from '../dtos/organisation-stage.dto';
import { AffinityCacheService } from './affinity-cache.service';

@Injectable()
export class AffinityEnricher {
  public constructor(
    private readonly affinityCacheService: AffinityCacheService,
  ) {}

  public async enrichOrganisations(
    organisations: OrganisationEntity[],
    additionalProcessing?: (
      entity: OrganisationEntity,
      data: OrganisationDataWithOpportunities,
    ) => OrganisationDataWithOpportunities,
  ): Promise<OrganisationDataWithOpportunities[]> {
    const affinityData = await this.affinityCacheService.getByDomains(
      organisations.flatMap((organisation) => organisation.domains),
    );

    const combinedData: OrganisationDataWithOpportunities[] = [];

    for (const organisation of organisations) {
      if (!organisation.domains[0]) {
        continue;
      }

      const result: OrganisationDataWithOpportunities =
        await this.enrichOrganisation(
          organisation,
          additionalProcessing,
          affinityData,
        );

      combinedData.push(result);
    }

    return combinedData;
  }

  public async enrichOrganisation(
    organisation: OrganisationEntity,
    additionalProcessing?: (
      entity: OrganisationEntity,
      data: OrganisationDataWithOpportunities,
    ) => OrganisationDataWithOpportunities,
    affinityDataFetched?: OrganizationStageDto[],
  ): Promise<OrganisationDataWithOpportunities> {
    const affinityData = affinityDataFetched
      ? affinityDataFetched
      : await this.affinityCacheService.getByDomains(organisation.domains);

    const matchedOrganization = affinityData.find((org) =>
      org.organizationDto.domains.includes(organisation.domains[0]),
    );

    const result: OrganisationDataWithOpportunities =
      this.buildOrganisationData(organisation, matchedOrganization);

    return additionalProcessing
      ? additionalProcessing(organisation, result)
      : result;
  }

  public async enrichOpportunities(
    opportunities: OpportunityEntity[],
    additionalProcessing?: (
      entity: OpportunityEntity,
      data: OpportunityData,
    ) => OpportunityData,
  ): Promise<OpportunityData[]> {
    const affinityData = await this.affinityCacheService.getByDomains(
      opportunities.flatMap((opportunity) => opportunity.organisation.domains),
    );

    const combinedData: OpportunityData[] = [];

    for (const opportunity of opportunities) {
      if (!opportunity.organisation?.domains[0]) {
        continue;
      }

      const result: OpportunityData = await this.enrichOpportunity(
        opportunity,
        additionalProcessing,
        affinityData,
      );

      combinedData.push(result);
    }

    return combinedData;
  }

  public async enrichOpportunity(
    opportunity: OpportunityEntity,
    additionalProcessing?: (
      entity: OpportunityEntity,
      data: OpportunityData,
    ) => OpportunityData,
    affinityDataFetched?: OrganizationStageDto[],
  ): Promise<OpportunityData> {
    const affinityData = affinityDataFetched
      ? affinityDataFetched
      : await this.affinityCacheService.getByDomains(
          opportunity.organisation.domains,
        );

    const matchedOrganization = affinityData.find((org) =>
      org.organizationDto.domains.includes(opportunity.organisation.domains[0]),
    );

    const result: OpportunityData = this.buildOpportunityData(
      opportunity,
      matchedOrganization,
    );

    return additionalProcessing
      ? additionalProcessing(opportunity, result)
      : result;
  }

  private buildOpportunityData(
    opportunity: OpportunityEntity,
    affinityOrganization: OrganizationStageDto,
  ): OpportunityData {
    return {
      ...this.buildBaseOpportunityData(opportunity, affinityOrganization),
      organisation: this.buildBaseOrganisationData(
        opportunity.organisation,
        affinityOrganization,
      ),
    };
  }

  private buildBaseOpportunityData(
    opportunity: OpportunityEntity,
    organization: OrganizationStageDto,
  ): OpportunityDataWithoutOrganisation {
    return {
      ...opportunity,
      stage: {
        id: opportunity.pipelineStageId,
        displayName: undefined,
        order: undefined,
        mappedFrom: undefined,
      },
      fields:
        organization?.fields.map((field) => {
          return {
            displayName: field.displayName,
            value: field.value,
          };
        }) || [],
    };
  }

  private buildBaseOrganisationData(
    organisation: OrganisationEntity,
    affinityOrganization: OrganizationStageDto,
  ): OrganisationData {
    return {
      affinityInternalId: affinityOrganization
        ? affinityOrganization.organizationDto.id
        : undefined,
      id: organisation.id,
      name: affinityOrganization
        ? affinityOrganization.organizationDto.name
        : organisation.name,
      domains: affinityOrganization
        ? affinityOrganization.organizationDto.domains
        : organisation.domains,
      affinityUrl: affinityOrganization
        ? `${environment.affinity.affinityUrl}companies/${affinityOrganization.organizationDto.id}`
        : undefined,
    } as OrganisationData;
  }

  private buildOrganisationData(
    organisation: OrganisationEntity,
    affinityOrganization: OrganizationStageDto,
  ): OrganisationDataWithOpportunities {
    return {
      ...this.buildBaseOrganisationData(organisation, affinityOrganization),
      opportunities: organisation.opportunities.map((opportunity) =>
        this.buildBaseOpportunityData(opportunity, affinityOrganization),
      ),
    };
  }
}
