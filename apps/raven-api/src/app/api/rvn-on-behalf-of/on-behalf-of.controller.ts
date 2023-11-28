import { AccountInfo } from '@azure/msal-common';
import {
  AuthenticationResult,
  ConfidentialClientApplication,
  OnBehalfOfRequest,
} from '@azure/msal-node';
import { Controller, Get, Headers } from '@nestjs/common';

import { Client } from '@microsoft/microsoft-graph-client';
import { DirectoryObject, User } from '@microsoft/microsoft-graph-types';
import { ApiOAuth2, ApiParam, ApiTags } from '@nestjs/swagger';
import { environment } from '../../../environments/environment';

@ApiTags('On Behalf Of Management')
@Controller('on-behalf-of')
@ApiOAuth2(['https://raven.test.mubadalacapital.ae/api'])
export class OnBehalfOfController {
  public constructor(
    private readonly confidentialClientApplication: ConfidentialClientApplication,
    private readonly graphClient: Client,
  ) {}

  @Get('me')
  public async getMe(): Promise<User> {
    const response = await this.graphClient.api('/me').get();
    return response as User;
  }

  @Get('test-folder')
  public async createFolderTest(): Promise<DirectoryObject> {
    const driveItem = {
      name: 'New Test Folder',
      folder: {},
      '@microsoft.graph.conflictBehavior': 'rename',
    };
    let response;
    try {
      response = await this.graphClient
        .api('/me/drive/root/children')
        .post(driveItem);
    } catch (error) {
      console.log({ error });
    }

    return response;
  }

  @Get('account-info')
  public async getAllAccounts(): Promise<AccountInfo[]> {
    return await this.confidentialClientApplication
      .getTokenCache()
      .getAllAccounts();
  }
  @Get('test-hit')
  @ApiParam({
    name: 'Authorization',
    required: false,
    description: '(Leave empty. Use lock icon on the top-right to authorize)',
  })
  public async testHit(
    @Headers('Authorization') authorization: string,
  ): Promise<AuthenticationResult> {
    const access_token = authorization.split(' ')[1];
    const oboRequest: OnBehalfOfRequest = {
      oboAssertion: access_token,
      scopes: ['openid'],
      authority: environment.azureAd.authority,
    } as OnBehalfOfRequest;
    const result =
      await this.confidentialClientApplication.acquireTokenOnBehalfOf(
        oboRequest,
      );

    return result;
  }
}
