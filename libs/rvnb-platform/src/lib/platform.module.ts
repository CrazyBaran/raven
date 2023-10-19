import Redis from 'ioredis';

import { DynamicModule, Module } from '@nestjs/common';
import { RedisOptions } from 'ioredis/built/redis/RedisOptions';
import { PlatformController } from './platform.controller';
import { PlatformService } from './platform.service';

export interface PlatformModuleOptions {
  readonly disableDbTest?: boolean;
  readonly disableRedisTest?: boolean;
  readonly redisOptions?: RedisOptions;
}

const PLATFORM_MODULE_OPTIONS = 'PLATFORM_MODULE_OPTIONS';

@Module({})
export class PlatformModule {
  public static register(options: PlatformModuleOptions): DynamicModule {
    return {
      module: PlatformModule,
      providers: [
        PlatformService,
        {
          provide: Redis,
          useFactory: (): Redis => {
            if (!options.disableRedisTest && options.redisOptions) {
              return new Redis({
                ...options.redisOptions,
                retryStrategy: (times): number =>
                  times > 3 ? undefined : 5000,
              });
            }
          },
        },
        { provide: PLATFORM_MODULE_OPTIONS, useValue: options },
      ],
      controllers: [PlatformController],
    };
  }
}
