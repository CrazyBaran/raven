import { BlobServiceClient } from '@azure/storage-blob';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '../../../environments/environment';
import { StorageAccountFileEntity } from './entities/storage-account-file.entity';
import { StorageAccountClient } from './storage-account.client';
import { StorageAccountController } from './storage-account.controller';
import { StorageAccountService } from './storage-account.service';
import { StorageAccountServiceLogger } from './storage-account.service.logger';

@Module({
  imports: [TypeOrmModule.forFeature([StorageAccountFileEntity]), ConfigModule],
  providers: [
    StorageAccountService,
    StorageAccountServiceLogger,
    StorageAccountClient,
    {
      provide: BlobServiceClient,
      useFactory: () => {
        return BlobServiceClient.fromConnectionString(
          environment.azureStorageAccount.connectionString,
        );
      },
    },
  ],
  controllers: [StorageAccountController],
})
export class StorageAccountModule {}
