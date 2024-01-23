import { CompanyDto, FounderDto } from '@app/shared/data-warehouse';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RedisStore } from 'cache-manager-ioredis-yet';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { DWH_CACHE } from '../data-warehouse.const';

@Injectable()
export class DataWarehouseCacheService {
  public constructor(
    private readonly logger: RavenLogger,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.logger.setContext(DataWarehouseCacheService.name);
  }

  private get store(): RedisStore {
    return this.cacheManager.store as RedisStore;
  }

  public async addOrReplaceMany(organisations: CompanyDto[]): Promise<void> {
    this.logger.debug(`Adding ${organisations.length} organisations to cache`);
    const pipeline = this.store.client.pipeline();
    for (const organisation of organisations) {
      pipeline.hset(
        DWH_CACHE.COMPANIES,
        organisation.domain,
        JSON.stringify(organisation),
      );
    }
    this.logger.debug(
      `Finished adding ${organisations.length} organisations to cache, executing pipeline`,
    );
    await pipeline.exec();
    this.logger.debug(`Finished executing pipeline`);
  }

  public async getCompanyCount(): Promise<number> {
    return await this.store.client.hlen(DWH_CACHE.COMPANIES);
  }

  public async getPagedCompanies(
    skip: number = 0,
    take: number = 500,
  ): Promise<CompanyDto[]> {
    const cursor = `${skip}`;
    const [newCursor, fields] = await this.store.client.hscan(
      DWH_CACHE.COMPANIES,
      cursor,
      'COUNT',
      take,
    );

    const fieldsEven = fields.filter((_, index) => index % 2 === 1);
    return fieldsEven.map((field) => this.parseCompany(field));
  }

  public async getFounder(name: string): Promise<FounderDto> {
    const item = await this.store.client.hget(DWH_CACHE.FOUNDERS, name.trim());
    if (!item) {
      return null;
    }
    return this.parseFounder(item);
  }

  public async setLastUpdated(date: Date): Promise<void> {
    await this.store.client.set(DWH_CACHE.LAST_UPDATED, date.toISOString());
  }

  public async getLastUpdated(): Promise<Date> {
    const lastUpdated = await this.store.client.get(DWH_CACHE.LAST_UPDATED);
    return lastUpdated ? new Date(Date.parse(lastUpdated)) : null;
  }

  public async getCompanies(domains: string[]): Promise<CompanyDto[]> {
    const items: CompanyDto[] = [];

    for (const domain of domains) {
      const item = await this.getCompany(domain);
      if (item) {
        items.push(item);
      }
    }
    return items;
  }

  public async getFounders(names: string[]): Promise<FounderDto[]> {
    const items: FounderDto[] = [];

    for (const name of names) {
      const item = await this.getFounder(name);
      if (item) {
        items.push(item);
      }
    }
    return items;
  }

  public async getCompany(domain: string): Promise<CompanyDto> {
    const item = await this.store.client.hget(DWH_CACHE.COMPANIES, domain);
    if (!item) {
      return null;
    }
    return this.parseCompany(item);
  }

  public async isForcedRegeneration(): Promise<boolean> {
    const flag = await this.store.client.get(DWH_CACHE.FORCED_REGENERATION);
    return flag === 'true';
  }

  public async forceRegeneration(): Promise<void> {
    await this.store.client.set(DWH_CACHE.FORCED_REGENERATION, 'true');
  }

  public async clearForceRegeneration(): Promise<void> {
    if (await this.store.client.exists(DWH_CACHE.FORCED_REGENERATION)) {
      await this.store.client.del(DWH_CACHE.FORCED_REGENERATION);
    }
  }

  public async reset(): Promise<void> {
    if (await this.store.client.exists(DWH_CACHE.COMPANIES)) {
      await this.store.client.del(DWH_CACHE.COMPANIES);
    }
  }

  private parseCompany(item: string): CompanyDto {
    const parsedItem = JSON.parse(item) as CompanyDto;
    return {
      ...parsedItem,
    };
  }

  private parseFounder(item: string): FounderDto {
    const parsedItem = JSON.parse(item) as FounderDto;
    return {
      ...parsedItem,
    };
  }
}
