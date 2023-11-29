import { AccountInfo } from '@azure/msal-common';
import {
  AuthenticationResult,
  ConfidentialClientApplication,
  OnBehalfOfRequest,
} from '@azure/msal-node';
import { Controller, Get, Headers, Query } from '@nestjs/common';

import { Client } from '@microsoft/microsoft-graph-client';
import { User } from '@microsoft/microsoft-graph-types';
import { ApiOAuth2, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
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

  // leaving these endpoints for convenience of setting up config values
  @Get('site-id')
  @ApiQuery({
    name: 'domain',
    type: String,
    required: true,
    description: 'e.g. testonemubadala.sharepoint.com',
  })
  @ApiQuery({
    name: 'site',
    type: String,
    required: true,
    description: 'e.g. mctestraven',
  })
  public async getSiteId(
    @Query('domain') domain: string,
    @Query('site') site: string,
  ): Promise<string> {
    const response = await this.graphClient
      .api(`https://graph.microsoft.com/v1.0/sites/${domain}:/sites/${site}`)
      .get();
    return response.id;
  }

  @Get('drives')
  @ApiQuery({
    name: 'siteId',
    type: String,
    required: true,
    description: 'can be obtained by calling GET /on-behalf-of/site-id',
  })
  public async getDriveId(@Query('siteId') siteId: string): Promise<string> {
    const response = await this.graphClient
      .api(`https://graph.microsoft.com/v1.0/sites/${siteId}/drives`)
      .get();
    return response.value;
  }

  @Get('folder-id')
  @ApiQuery({
    name: 'siteId',
    type: String,
    required: true,
    description: 'can be obtained by calling GET /on-behalf-of/site-id',
  })
  @ApiQuery({
    name: 'driveId',
    type: String,
    required: true,
    description: 'can be obtained by calling GET /on-behalf-of/drives',
  })
  @ApiQuery({
    name: 'folderName',
    type: String,
    required: true,
    description: 'name of the folder to get the id for',
  })
  public async getFolderId(
    @Query('siteId') siteId: string,
    @Query('driveId') driveId: string,
    @Query('folderName') folderName: string,
  ): Promise<string> {
    try {
      const response = await this.graphClient
        .api(
          `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:/${folderName}`,
        )
        .get();
      console.log({ response });
      return response.value;
    } catch (e) {
      console.log({ e });
    }
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
