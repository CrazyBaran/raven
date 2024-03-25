import {
  CompanyDto,
  ContactDto,
  DataWarehouseLastUpdatedDto,
  FundingRoundDto,
  NewsDto,
  NumberOfEmployeesSnapshotDto,
} from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobPro } from '@taskforcesh/bullmq-pro';
import { PagedData } from 'rvns-shared';
import { Repository } from 'typeorm';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { DataWarehouseCacheService } from './cache/data-warehouse-cache.service';
import { DataWarehouseAccessBase } from './interfaces/data-warehouse.access.base';
import { DataWarehouseCompaniesIndustryV1Entity } from './proxy/entities/data-warehouse-company-industries.v1.entity';
import { DataWarehouseCompaniesInvestorV1Entity } from './proxy/entities/data-warehouse-company-investors.v1.entity';

@Injectable()
export class DataWarehouseService {
  public constructor(
    private readonly logger: RavenLogger,
    private readonly dataWarehouseAccessService: DataWarehouseAccessBase,
    private readonly dataWarehouseCacheService: DataWarehouseCacheService,
    @InjectRepository(DataWarehouseCompaniesIndustryV1Entity)
    private readonly dataWarehouseCompaniesIndustryV1Repository: Repository<DataWarehouseCompaniesIndustryV1Entity>,
    @InjectRepository(DataWarehouseCompaniesInvestorV1Entity)
    private readonly dataWarehouseCompaniesInvestorV1Repository: Repository<DataWarehouseCompaniesInvestorV1Entity>,
  ) {
    this.logger.setContext(DataWarehouseService.name);
  }

  public async regenerateCache(
    job: JobPro,
    options?: {
      chunkSize?: number;
    },
  ): Promise<void> {
    const chunkSize = options?.chunkSize ?? 500;

    await this.dataWarehouseCacheService.resetCompanies();

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

  public async regenerateStaticCache(
    job: JobPro,
    options?: {
      chunkSize?: number;
    },
  ): Promise<void> {
    await this.dataWarehouseCacheService.resetIndustries();
    const industries = await this.dataWarehouseAccessService.getIndustries();
    await this.dataWarehouseCacheService.setIndustries(industries);

    await job.updateProgress(50);

    await this.dataWarehouseCacheService.resetInvestors();
    const investors = await this.dataWarehouseAccessService.getInvestors();
    await this.dataWarehouseCacheService.setInvestors(investors);
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

  public async getInvestors(options?: {
    skip?: number;
    take?: number;
    query?: string;
  }): Promise<string[]> {
    const collate = 'COLLATE SQL_Latin1_General_CP1_CI_AS';
    const queryBuilder =
      this.dataWarehouseCompaniesInvestorV1Repository.createQueryBuilder(
        'investors',
      );
    if (options.query) {
      queryBuilder.where(
        `investors.name ${collate} LIKE '%${options.query}%' ${collate} `,
      );
    }

    queryBuilder
      .skip(options.skip ? options.skip : 0)
      .take(options.take ? options.take : 25);

    const result = await queryBuilder.getMany();
    return result.map((investor) => investor.name);
  }

  public async getIndustries(options?: {
    skip?: number;
    take?: number;
    query?: string;
  }): Promise<string[]> {
    const collate = 'COLLATE SQL_Latin1_General_CP1_CI_AS';
    const queryBuilder =
      this.dataWarehouseCompaniesIndustryV1Repository.createQueryBuilder(
        'industries',
      );
    if (options.query) {
      queryBuilder.where(
        `industries.name ${collate} LIKE '%${options.query}%' ${collate} `,
      );
    }

    queryBuilder
      .skip(options.skip ? options.skip : 0)
      .take(options.take ? options.take : 25);

    const result = await queryBuilder.getMany();
    return result.map((industry) => industry.name);
  }

  public async getNews(
    domains: string[],
    skip?: number,
    take?: number,
  ): Promise<PagedData<Partial<NewsDto>>> {
    return await this.dataWarehouseAccessService.findAndMapNews(
      domains,
      skip,
      take,
    );
  }

  public async getContacts(
    domains: string[],
    skip?: number,
    take?: number,
  ): Promise<PagedData<Partial<ContactDto>>> {
    return await this.dataWarehouseAccessService.findAndMapContacts(
      domains,
      skip,
      take,
    );
  }

  public async getEmployees(
    domains: string[],
    skip?: number,
    take?: number,
  ): Promise<PagedData<Partial<NumberOfEmployeesSnapshotDto>>> {
    return await this.dataWarehouseAccessService.findAndMapEmployees(
      domains,
      skip,
      take,
    );
  }

  public async getFundingRounds(
    domains: string[],
    skip?: number,
    take?: number,
  ): Promise<PagedData<Partial<FundingRoundDto>>> {
    return await this.dataWarehouseAccessService.findAndMapFundingRounds(
      domains,
      skip,
      take,
    );
  }
}
