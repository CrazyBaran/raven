import {
  ConfidentialClientApplication,
  SilentFlowRequest,
} from '@azure/msal-node';
import {
  AuthenticationProvider,
  AuthenticationProviderOptions,
} from '@microsoft/microsoft-graph-client';
import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from '../rvn-auth/auth-cls.store';

@Injectable()
export class CustomAuthenticationProvider implements AuthenticationProvider {
  public constructor(
    private readonly confidentialClientApplication: ConfidentialClientApplication,
    private readonly cls: ClsService<AuthClsStore>,
  ) {}

  public async getAccessToken(
    authenticationProviderOptions: AuthenticationProviderOptions | undefined,
  ): Promise<string> {
    console.log(JSON.stringify(authenticationProviderOptions));

    const localAccountId = await this.cls.get('localAccountId');
    const account = await this.confidentialClientApplication
      .getTokenCache()
      .getAccountByLocalId(localAccountId);

    console.log(JSON.stringify(account));

    const request: SilentFlowRequest = {
      account: account,
      scopes: [], // Here should go the scopes for the Graph API. It would need to be find out which one and also move it to config.
    } as SilentFlowRequest;
    const response =
      await this.confidentialClientApplication.acquireTokenSilent(request);
    return response.accessToken;
  }
}
