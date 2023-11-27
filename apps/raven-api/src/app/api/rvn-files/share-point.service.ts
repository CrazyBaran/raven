import { Configuration } from '@azure/msal-node';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SharePointService {
  public constructor() {
    const configuration: Configuration = {
      auth: {
        authority: 'https://login.microsoftonline.com/{tenant Id}/',
        clientId: '{AAD Application Id/Client Id}',
      },
    };
  }

  public async getFilesFromFolder(folderUrl: string): Promise<any> {}
}
