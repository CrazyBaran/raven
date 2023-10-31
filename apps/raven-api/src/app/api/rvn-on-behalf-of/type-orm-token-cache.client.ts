import { CryptoHelper } from '@app/rvnb-crypto';
import { ICacheClient } from '@azure/msal-node';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { environment } from '../../../environments/environment';
import { CcaTokenCacheEntity } from './entities/cca-token-cache.entity';

@Injectable()
export class TypeOrmTokenCacheClient implements ICacheClient {
  public constructor(
    @InjectRepository(CcaTokenCacheEntity)
    private readonly tokenCacheRepository: Repository<CcaTokenCacheEntity>,
    private readonly cryptoHelper: CryptoHelper,
  ) {}
  public async get(key: string): Promise<string> {
    const tokenCache = await this.tokenCacheRepository.findOne({
      where: { key },
      cache: {
        id: `token-cache-${key}`,
        milliseconds: 30 * 60 * 1000, // 30 minutes * 60 seconds * 1000 milliseconds
      },
    });

    if (!tokenCache) {
      return '';
    }

    if (!tokenCache.isEncrypted) {
      return tokenCache.value;
    }

    return await this.cryptoHelper.decrypt(tokenCache.value);
  }

  public async set(key: string, value: string): Promise<string> {
    const shouldEncryptCcaCache = environment.azureAd.shouldEncryptCcaCache;
    let valueToSave = value;

    if (shouldEncryptCcaCache) {
      valueToSave = await this.cryptoHelper.encrypt(value);
    }

    await this.tokenCacheRepository.save({
      key,
      value: valueToSave,
      isEncrypted: shouldEncryptCcaCache,
    });

    await this.tokenCacheRepository.manager.connection.queryResultCache.remove([
      `token-cache-${key}`,
    ]);

    return value;
  }
}
