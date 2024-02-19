import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RedisStore } from 'cache-manager-ioredis-yet';
import { AFFINITY_CACHE, AFFINITY_FIELDS_CACHE } from '../affinity.const';
import { FieldDto } from '../api/dtos/field.dto';
import { OrganizationStageDto } from '../dtos/organisation-stage.dto';

@Injectable()
export class AffinityCacheService {
  public constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private get store(): RedisStore {
    return this.cacheManager.store as RedisStore;
  }

  public async addOrReplaceMany(
    organisations: OrganizationStageDto[],
  ): Promise<void> {
    const pipeline = this.store.client.pipeline();
    for (const organisation of organisations) {
      pipeline.hset(
        AFFINITY_CACHE,
        organisation.organizationDto.domains.join(',').toString(),
        JSON.stringify(organisation),
      );
    }
    await pipeline.exec();
  }

  public async getAll(
    filters?: (data: OrganizationStageDto) => boolean,
  ): Promise<OrganizationStageDto[]> {
    const rawData = await this.store.client.hgetall(AFFINITY_CACHE);
    let data = Object.values(rawData).map((item) =>
      this.parseOrganisationStageDto(item),
    );

    // Apply filters if provided
    if (filters) {
      data = data.filter(filters);
    }
    return data;
  }

  public async getByDomains(
    domains: string[],
  ): Promise<OrganizationStageDto[]> {
    const keys = await this.store.client.hkeys(AFFINITY_CACHE);
    const matchingKeys = keys.filter((key) =>
      domains.some((domain) => key.includes(domain)),
    );
    if (matchingKeys.length === 0) return [];
    const matchingItems = await this.store.client.hmget(AFFINITY_CACHE, ...matchingKeys);
    return matchingItems.map((value) =>
      this.parseOrganisationStageDto(value),
    );
  }

  public async reset(): Promise<void> {
    if (await this.store.client.exists(AFFINITY_CACHE)) {
      await this.store.client.del(AFFINITY_CACHE);
    }
  }

  public async setListFields(fields: FieldDto[]): Promise<void> {
    const pipeline = this.store.client.pipeline();

    for (const field of fields) {
      pipeline.hset(AFFINITY_FIELDS_CACHE, field.name, JSON.stringify(field));
    }
    await pipeline.exec();
  }

  public async getListFields(): Promise<FieldDto[]> {
    const rawData = await this.store.client.hgetall(AFFINITY_FIELDS_CACHE);
    return Object.values(rawData).map((item) => JSON.parse(item));
  }

  private parseOrganisationStageDto(item): OrganizationStageDto {
    const parsedItem = JSON.parse(item) as OrganizationStageDto;
    return {
      ...parsedItem,
      entryAdded: new Date(parsedItem.entryAdded),
    };
  }
}
