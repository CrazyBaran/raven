import { BlobServiceClient } from '@azure/storage-blob';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '../../../environments/environment';
import { StorageAccountFileEntity } from './entities/storage-account-file.entity';
import { StorageAccountProxyMiddleware } from './storage-account-proxy.middleware';
import { StorageAccountProxyMiddlewareLogger } from './storage-account-proxy.middleware.logger';
import { StorageAccountClient } from './storage-account.client';
import { StorageAccountClientLogger } from './storage-account.client.logger';
import { StorageAccountController } from './storage-account.controller';
import { StorageAccountService } from './storage-account.service';
import { StorageAccountServiceLogger } from './storage-account.service.logger';

@Module({
  imports: [TypeOrmModule.forFeature([StorageAccountFileEntity]), ConfigModule],
  providers: [
    StorageAccountService,
    StorageAccountServiceLogger,
    StorageAccountClient,
    StorageAccountClientLogger,
    StorageAccountProxyMiddleware,
    StorageAccountProxyMiddlewareLogger,
    {
      provide: BlobServiceClient,
      useFactory: (): BlobServiceClient => {
        return BlobServiceClient.fromConnectionString(
          environment.azureStorageAccount.connectionString,
        );
      },
    },
  ],
  controllers: [StorageAccountController],
})
export class StorageAccountModule {}
