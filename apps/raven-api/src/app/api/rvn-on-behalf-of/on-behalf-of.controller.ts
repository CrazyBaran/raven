import { AccountInfo } from '@azure/msal-common';
import {
  AuthenticationResult,
  ConfidentialClientApplication,
  OnBehalfOfRequest,
} from '@azure/msal-node';
import { Controller, Get, Headers } from '@nestjs/common';

import { ApiOAuth2, ApiParam, ApiTags } from '@nestjs/swagger';
import { environment } from '../../../environments/environment';

@ApiTags('On Behalf Of Management')
@Controller('on-behalf-of')
@ApiOAuth2(['https://raven.test.mubadalacapital.ae/api'])
export class OnBehalfOfController {
  public constructor(
    private readonly confidentialClientApplication: ConfidentialClientApplication,
  ) {}

  @Get('account-info')
  public async getAllAccounts(): Promise<AccountInfo[]> {
    return await this.confidentialClientApplication
      .getTokenCache()
      .getAllAccounts();
  }
  t;
  @Get('TestHit')
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
