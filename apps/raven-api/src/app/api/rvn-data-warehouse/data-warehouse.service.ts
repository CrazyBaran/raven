import {
  CompanyDto,
  CompanyFilterOptions,
  DataWarehouseLastUpdatedDto,
  FounderDto,
  GetCompaniesOptions,
} from '@app/shared/data-warehouse';
import { Inject, Injectable } from '@nestjs/common';
import { JobPro } from '@taskforcesh/bullmq-pro';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { DataWarehouseCacheService } from './cache/data-warehouse-cache.service';
import { DWH_SERVICE } from './data-warehouse.const';
import { DataWarehouseAccessService } from './v1/data-warehouse.access.service';

@Injectable()
export class DataWarehouseService {
  public constructor(
    private readonly logger: RavenLogger,
    @Inject(DWH_SERVICE)
    private readonly dataWarehouseAccessService: DataWarehouseAccessService,
    private readonly dataWarehouseCacheService: DataWarehouseCacheService,
  ) {
    this.logger.setContext(DataWarehouseService.name);
  }

  public async regenerateCache(
    job: JobPro,
    options?: {
      chunkSize?: number;
    },
  ): Promise<void> {
    const chunkSize = options?.chunkSize ?? 2000;

    await this.dataWarehouseCacheService.reset();

    const count = await this.dataWarehouseAccessService.getCount();
    const chunks = Math.ceil(count / chunkSize);
    for (let i = 0; i < chunks; i++) {
      const offset = i * chunkSize;
      const companies = await this.dataWarehouseAccessService.getCompanies({
        skip: offset,
        take: chunkSize,
      });
      await this.dataWarehouseCacheService.addOrReplaceMany(companies);

      await job.updateProgress(Math.floor((i / chunks) * 100));
    }

    await this.dataWarehouseCacheService.setLastChecked(new Date(Date.now()));
    await this.dataWarehouseCacheService.setLastUpdated(new Date(Date.now()));
    await this.dataWarehouseCacheService.setNewestEntryDate(
      (await this.dataWarehouseAccessService.getLastUpdated()).lastUpdated,
    );
  }

  public async getCompanyByDomain(
    domain: string,
  ): Promise<Partial<CompanyDto>> {
    const company = await this.dataWarehouseCacheService.getCompany(domain);
    if (company) {
      return company;
    }

    const companyFromApi = await this.dataWarehouseAccessService.getCompanies({
      domains: [domain],
    });

    if (companyFromApi.length === 0) {
      return null;
    }

    await this.dataWarehouseCacheService.addOrReplaceMany(companyFromApi);

    return companyFromApi[0];
  }

  public async getCompaniesByDomains(
    domains: string[],
  ): Promise<Partial<CompanyDto>[]> {
    const companies =
      await this.dataWarehouseCacheService.getCompanies(domains);

    const missingDomains = domains.filter(
      (domain) => !companies.some((company) => company.domain === domain),
    );

    if (missingDomains.length === 0) {
      return companies;
    }

    const companiesFromApi = await this.dataWarehouseAccessService.getCompanies(
      {
        domains: missingDomains,
      },
    );

    await this.dataWarehouseCacheService.addOrReplaceMany(companiesFromApi);

    return [...companies, ...companiesFromApi];
  }

  public async getFoundersByName(
    name: string,
  ): Promise<FounderDto[] | FounderDto> {
    const founders = await this.dataWarehouseCacheService.getFounder(name);
    return founders;
  }

  public async dataWarehouseChanged(): Promise<boolean> {
    const lastUpdated = await this.dataWarehouseAccessService.getLastUpdated();
    const lastUpdatedCached =
      await this.dataWarehouseCacheService.getLastUpdated();
    return lastUpdatedCached
      ? lastUpdatedCached < lastUpdated.lastUpdated
      : true;
  }

  public async regenerationForced(): Promise<boolean> {
    const forced = await this.dataWarehouseCacheService.isForcedRegeneration();
    return forced;
  }

  public async clearForceRegeneration(): Promise<void> {
    await this.dataWarehouseCacheService.clearForceRegeneration();
  }

  public async forceRegeneration(): Promise<void> {
    await this.dataWarehouseCacheService.forceRegeneration();
  }

  public async getLastUpdated(): Promise<DataWarehouseLastUpdatedDto> {
    return {
      lastChecked: await this.dataWarehouseCacheService.getLastChecked(),
      lastUpdated: await this.dataWarehouseCacheService.getLastUpdated(),
      companyCount: await this.dataWarehouseCacheService.getCompanyCount(),
      newestEntryDate:
        await this.dataWarehouseCacheService.getNewestEntryDate(),
    };
  }

  public async updateLastChecked(): Promise<void> {
    await this.dataWarehouseCacheService.setLastChecked(new Date(Date.now()));
  }

  public async getFilteredCompanies(
    options: GetCompaniesOptions,
    filterOptions?: CompanyFilterOptions,
  ): Promise<{ items: Partial<CompanyDto>[]; count: number }> {
    return await this.dataWarehouseAccessService.filterCompanies(
      options,
      filterOptions,
    );
  }
}
