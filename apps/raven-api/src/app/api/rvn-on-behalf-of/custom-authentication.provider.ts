import {
  ConfidentialClientApplication,
  OnBehalfOfRequest,
  SilentFlowRequest,
} from '@azure/msal-node';
import {
  AuthenticationProvider,
  AuthenticationProviderOptions,
} from '@microsoft/microsoft-graph-client';
import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { environment } from '../../../environments/environment';
import { AuthClsStore } from '../rvn-auth/auth-cls.store';
import { RavenLogger } from '../rvn-logger/raven.logger';

@Injectable()
export class CustomAuthenticationProvider implements AuthenticationProvider {
  public constructor(
    private readonly confidentialClientApplication: ConfidentialClientApplication,
    private readonly cls: ClsService<AuthClsStore>,
    private readonly logger: RavenLogger,
  ) {
    this.logger.setContext(CustomAuthenticationProvider.name);
  }

  public async getAccessToken(
    authenticationProviderOptions: AuthenticationProviderOptions | undefined,
  ): Promise<string> {
    const localAccountId = this.cls.get('localAccountId');
    const account = await this.confidentialClientApplication
      .getTokenCache()
      .getAccountByLocalId(localAccountId);

    if (!account) {
      this.logger.warn('No account found. Trying OBO.');
      return await this.initOnBehalfOf();
    }

    try {
      const request: SilentFlowRequest = {
        account: account,
        scopes: [], // TODO Here should go the scopes for the Graph API. It would need to be find out which one and also move it to config.
        // scopes: authenticationProviderOptions.scopes, // TODO maybe this will work?
      } as SilentFlowRequest;
      const response =
        await this.confidentialClientApplication.acquireTokenSilent(request);
      return response.accessToken;
    } catch (e) {
      this.logger.warn('Failed to get access token silently. Trying OBO.');
      return await this.initOnBehalfOf();
    }
  }

  private async initOnBehalfOf(): Promise<string> {
    const accessToken = this.cls.get('accessToken');
    const oboRequest: OnBehalfOfRequest = {
      oboAssertion: accessToken,
      scopes: [],
      authority: environment.azureAd.authority,
    } as OnBehalfOfRequest;
    const response =
      await this.confidentialClientApplication.acquireTokenOnBehalfOf(
        oboRequest,
      );
    return response.accessToken;
  }
}
