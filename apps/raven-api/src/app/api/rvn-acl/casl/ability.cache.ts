import { Cache } from 'cache-manager';

import { environment } from '../../../../environments/environment';
import { ShareAction } from '../enums/share-action.enum';
import { MongoQuery, SubjectRawRule, SubjectType } from '@casl/ability';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AbilityCache {
  public constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  public async set(
    userId: string,
    rules: SubjectRawRule<ShareAction, string, unknown>[],
  ): Promise<void> {
    if (environment.security.acl.cache.enabled) {
      const cacheKey = environment.security.acl.cache.redis.cacheKey;
      await this.cacheManager.set(`${cacheKey}:${userId}`, rules);
    }
  }

  public async get(
    userId: string,
  ): Promise<SubjectRawRule<ShareAction, SubjectType & string, MongoQuery>[]> {
    if (environment.security.acl.cache.enabled) {
      const cacheKey = environment.security.acl.cache.redis.cacheKey;
      return this.cacheManager.get(`${cacheKey}:${userId}`);
    }
    return null;
  }

  public async invalidate(userId: string): Promise<void> {
    if (environment.security.acl.cache.enabled) {
      const cacheKey = environment.security.acl.cache.redis.cacheKey;
      await this.cacheManager.del(`${cacheKey}:${userId}`);
    }
  }
}
