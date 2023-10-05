import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RedisStore } from 'cache-manager-ioredis-yet';
import { AFFINITY_CACHE } from '../affinity.const';
import { OrganizationStageDto } from '../dtos/organisation-stage.dto';

@Injectable()
export class AffinityCacheService {
  public constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private get store(): RedisStore {
    return this.cacheManager.store as RedisStore;
  }

  public async addOrReplaceMany(data: OrganizationStageDto[]): Promise<void> {
    const pipeline = this.store.client.pipeline();
    for (const d of data) {
      pipeline.hset(
        AFFINITY_CACHE,
        d.organizationDto.id.toString(),
        JSON.stringify(d),
      );
    }
    await pipeline.exec();
  }

  public async getAll(
    skip = 0,
    take = 10,
    filters?: (data: OrganizationStageDto) => boolean,
  ): Promise<OrganizationStageDto[]> {
    const rawData = await this.store.client.hgetall(AFFINITY_CACHE);
    let data = Object.values(rawData).map((item) => JSON.parse(item));

    // Apply filters if provided
    if (filters) {
      data = data.filter(filters);
    }

    // Apply paging using skip/take
    return data.slice(skip, skip + take);
  }

  public async get(id: string): Promise<OrganizationStageDto | null> {
    const rawData = await this.store.client.hget(AFFINITY_CACHE, id);
    return rawData ? JSON.parse(rawData) : null;
  }

  public async addOrReplace(data: OrganizationStageDto): Promise<void> {
    await this.store.client.hset(
      AFFINITY_CACHE,
      data.organizationDto.id.toString(),
      JSON.stringify(data),
    );
  }
}
