import { Injectable } from '@nestjs/common';
import { CreateStorageAccountFileResult } from './entities/create-storage-account-file.result';
import { StorageAccountFileEntity } from './entities/storage-account-file.entity';
import { StorageAccountClient } from './storage-account.client';
import { StorageAccountServiceLogger } from './storage-account.service.logger';

@Injectable()
export class StorageAccountService {
  public constructor(
    private readonly storageAccountClient: StorageAccountClient,
    private readonly storageAccountServiceLogger: StorageAccountServiceLogger,
  ) {}

  public async createStorageAccountFile(
    containerName: string,
    fileName: string,
  ): Promise<CreateStorageAccountFileResult> {
    const storageAccountFile = new StorageAccountFileEntity();
    storageAccountFile.fileName = fileName;

    const sasToken = await this.storageAccountClient.generateSASUrl(
      containerName,
      fileName,
      { create: true },
      600,
    );

    return {
      storageAccountFile,
      sasToken: sasToken,
    };
  }

  public async getSasTokenForFile(
    containerName: string,
    fileName: string,
  ): Promise<string> {
    return await this.storageAccountClient.generateSASUrl(
      containerName,
      fileName,
      { read: true },
      600,
    );
  }
}
