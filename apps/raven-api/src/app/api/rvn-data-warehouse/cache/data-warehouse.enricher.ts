import { OrganisationDataWithOpportunities } from '@app/rvns-opportunities';
import { CompanyDto } from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { DataWarehouseService } from '../data-warehouse.service';

@Injectable()
export class DataWarehouseEnricher {
  public constructor(
    private readonly logger: RavenLogger,
    private readonly dataWarehouseService: DataWarehouseService,
  ) {}

  public async enrichOrganisations(
    organisations: OrganisationDataWithOpportunities[],
  ): Promise<OrganisationDataWithOpportunities[]> {
    const combinedData: OrganisationDataWithOpportunities[] = [];

    const dataWarehouseData =
      await this.dataWarehouseService.getCompaniesByDomains(
        organisations.flatMap((organisation) => organisation.domains),
      );

    for (const organisation of organisations) {
      if (!organisation.domains[0]) {
        continue;
      }

      const result: OrganisationDataWithOpportunities =
        await this.enrichOrganisation(organisation, dataWarehouseData);

      combinedData.push(result);
    }

    return combinedData;
  }

  public async enrichOrganisation(
    organisation: OrganisationDataWithOpportunities,
    dataWarehouseDataFetched?: CompanyDto[],
  ): Promise<OrganisationDataWithOpportunities> {
    const dataWarehouseData = dataWarehouseDataFetched
      ? dataWarehouseDataFetched
      : [
          await this.dataWarehouseService.getCompanyByDomain(
            organisation.domains[0],
          ),
        ];

    const matchedOrganization = dataWarehouseData.find((org) =>
      organisation.domains.includes(org?.domain),
    );

    const result: OrganisationDataWithOpportunities =
      this.buildOrganisationData(organisation, matchedOrganization);

    return result;
  }

  private buildOrganisationData(
    organisation: OrganisationDataWithOpportunities,
    dataWarehouseOrganisation: CompanyDto,
  ): OrganisationDataWithOpportunities {
    return {
      ...organisation,
      data: dataWarehouseOrganisation,
    };
  }
}
