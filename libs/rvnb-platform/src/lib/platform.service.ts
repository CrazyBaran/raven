import Redis from 'ioredis';
import { EntityManager } from 'typeorm';

import { PlatformModuleOptions } from './platform.module';
import { Inject, Injectable, Optional } from '@nestjs/common';

@Injectable()
export class PlatformService {
  public constructor(
    @Inject('PLATFORM_MODULE_OPTIONS')
    private readonly platformOptions: PlatformModuleOptions,
    @Optional()
    private readonly entityManager: EntityManager,
    private readonly redis: Redis
  ) {}

  public async testDb(): Promise<boolean> {
    if (this.platformOptions.disableDbTest) {
      return true;
    }
    try {
      return (
        (await this.entityManager.connection.query('SELECT 1'))[0][''] === 1
      );
    } catch (e) {
      return false;
    }
  }

  public async testRedis(): Promise<boolean> {
    if (this.platformOptions.disableRedisTest) {
      return true;
    }
    try {
      return (await this.redis.ping()) === 'PONG';
    } catch (e) {
      return false;
    }
  }
}
