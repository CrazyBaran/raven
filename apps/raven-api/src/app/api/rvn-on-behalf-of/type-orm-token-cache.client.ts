import { ICacheClient } from '@azure/msal-node';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CcaTokenCacheEntity } from './entities/cca-token-cache.entity';

@Injectable()
export class TypeOrmTokenCacheClient implements ICacheClient {
  public constructor(
    @InjectRepository(CcaTokenCacheEntity)
    private readonly tokenCacheRepository: Repository<CcaTokenCacheEntity>,
  ) {}
  public async get(key: string): Promise<string> {
    const tokenCache = await this.tokenCacheRepository.findOne({
      where: { key },
      cache: {
        id: `token-cache-${key}`,
        milliseconds: 30 * 60 * 1000, // 30 minutes * 60 seconds * 1000 milliseconds
      },
    });

    return tokenCache ? tokenCache.value : '';
  }

  public async set(key: string, value: string): Promise<string> {
    const tokenCache = await this.tokenCacheRepository.save({
      key,
      value,
    });
    await this.tokenCacheRepository.manager.connection.queryResultCache.remove([
      `token-cache-${key}`,
    ]);

    return tokenCache.value;
  }
}
