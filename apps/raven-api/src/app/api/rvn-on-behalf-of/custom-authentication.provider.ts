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
    const localAccountId = this.cls.get('localAccountId');
    const account = await this.confidentialClientApplication
      .getTokenCache()
      .getAccountByLocalId(localAccountId);

    const request: SilentFlowRequest = {
      account: account,
      scopes: [], // TODO Here should go the scopes for the Graph API. It would need to be find out which one and also move it to config.
      // scopes: authenticationProviderOptions.scopes, // TODO maybe this will work?
    } as SilentFlowRequest;
    const response =
      await this.confidentialClientApplication.acquireTokenSilent(request);
    return response.accessToken;
  }
}
