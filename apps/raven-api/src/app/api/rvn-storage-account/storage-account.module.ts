import { BlobServiceClient } from '@azure/storage-blob';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '../../../environments/environment';
import { StorageAccountFileEntity } from './entities/storage-account-file.entity';
import { StorageAccountProxyMiddleware } from './storage-account-proxy.middleware';
import { StorageAccountClient } from './storage-account.client';
import { StorageAccountController } from './storage-account.controller';
import { StorageAccountService } from './storage-account.service';

@Module({
  imports: [TypeOrmModule.forFeature([StorageAccountFileEntity]), ConfigModule],
  providers: [
    StorageAccountService,
    StorageAccountClient,
    StorageAccountProxyMiddleware,
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
  exports: [
    StorageAccountService,
    StorageAccountClient,
    {
      provide: BlobServiceClient,
      useFactory: (): BlobServiceClient => {
        return BlobServiceClient.fromConnectionString(
          environment.azureStorageAccount.connectionString,
        );
      },
    },
  ],
})
export class StorageAccountModule {}
