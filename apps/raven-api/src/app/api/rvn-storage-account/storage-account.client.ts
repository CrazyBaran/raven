import {
  BlobSASPermissions,
  BlobSASPermissionsLike,
  BlobServiceClient,
  ContainerClient,
  SASProtocol,
} from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { environment } from '../../../environments/environment';
import { StorageAccountClientLogger } from './storage-account.client.logger';

@Injectable()
export class StorageAccountClient {
  public constructor(
    private readonly blobServiceClient: BlobServiceClient,
    private readonly logger: StorageAccountClientLogger,
  ) {}
  public async generateSASUrl(
    containerName: string,
    fileName: string,
    permissions: BlobSASPermissionsLike = { read: true }, // default read only
    timeRange = 10, // default 10 seconds
  ): Promise<string> {
    this.logger.debug(`Generating SAS URL for ${containerName}/${fileName}`);
    const serviceName = environment.azureStorageAccount.name;

    if (!serviceName) {
      this.logger.error('Storage account name or key not configured');
      throw new Error('Storage account name or key not configured');
    }

    if (!containerName || !fileName) {
      this.logger.error('Container name or file name cannot be null or empty');
      throw new Error('Container name or file name cannot be null or empty');
    }

    const containerClient = await this.getContainerClient(
      containerName,
      this.blobServiceClient,
    );

    this.logger.debug(`Getting block blob client for ${fileName}`);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    // Best practice: create time limits, default it's 10 seconds
    const TIMESPAN = timeRange * 1000;
    const NOW = new Date();

    this.logger.debug(
      `Generating SAS URL for ${fileName} with permissions ${permissions} and time range ${TIMESPAN}`,
    );
    const originalSasUrl = await blockBlobClient.generateSasUrl({
      startsOn: NOW,
      expiresOn: new Date(new Date().valueOf() + TIMESPAN),
      permissions: BlobSASPermissions.from(permissions),
      protocol: SASProtocol.Https, // Only allow HTTPS access to the blob
    });
    const sasUrl = new URL(originalSasUrl);
    console.log(sasUrl);
    return sasUrl.toString();
  }

  private async getContainerClient(
    containerName: string,
    blobServiceClient: BlobServiceClient,
  ): Promise<ContainerClient> {
    this.logger.debug(`Getting container client for ${containerName}`);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    if (
      environment.azureStorageAccount.createIfNotExists &&
      !(await containerClient.exists())
    ) {
      this.logger.debug(
        `Container ${containerName} does not exist, creating it`,
      );
      await containerClient.createIfNotExists();
    }

    return containerClient;
  }
}
