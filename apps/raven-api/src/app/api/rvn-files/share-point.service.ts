import { Configuration } from '@azure/msal-node';
import { Injectable } from '@nestjs/common';

interface FileDetails {
  id: string;
  name: string;
  path: string;
}

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

  public async getFilesFromFolder(folderUrl: string): Promise<FileDetails[]> {
    return [
      {
        id: 'temp',
        name: 'temp',
        path: 'temp',
      },
    ];
  }

  public async getFileDetails(sharepointId: string): Promise<FileDetails> {
    return {
      id: 'temp',
      name: 'temp',
      path: 'temp',
    };
  }
}
