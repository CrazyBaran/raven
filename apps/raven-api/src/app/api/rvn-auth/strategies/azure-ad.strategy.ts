import { BearerStrategy } from 'passport-azure-ad';

import { AzureAdPayload, UserRegisterEvent } from '@app/rvns-auth';
import {
  ConfidentialClientApplication,
  OnBehalfOfRequest,
} from '@azure/msal-node';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PassportStrategy } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { environment } from '../../../../environments/environment';
import { UsersCacheService } from '../../rvn-users/users-cache.service';
import { AuthClsStore } from '../auth-cls.store';

@Injectable()
export class AzureADStrategy extends PassportStrategy(
  BearerStrategy,
  'AzureAD',
) {
  public constructor(
    private readonly usersCacheService: UsersCacheService,
    private readonly confidentialClientApplication: ConfidentialClientApplication,
    protected readonly eventEmitter: EventEmitter2,
    private readonly cls: ClsService<AuthClsStore>,
  ) {
    super({
      identityMetadata: environment.azureAd.identityMetadata,
      clientID: environment.azureAd.clientId,
      passReqToCallback: true,
      issuer: [environment.azureAd.issuer],
      audience: [environment.azureAd.audience],
      loggingLevel: 'error',
    });
  }

  public async validate(
    req: Request,
    response: AzureAdPayload,
  ): Promise<AzureAdPayload> {
    const userRegistered = await this.usersCacheService.get(
      response[environment.azureAd.tokenKeys.azureId],
    );
    if (!userRegistered) {
      this.eventEmitter.emit(
        'user-register',
        new UserRegisterEvent(
          response[environment.azureAd.tokenKeys.azureId],
          response[environment.azureAd.tokenKeys.name],
          response[environment.azureAd.tokenKeys.email],
          response[environment.azureAd.tokenKeys.roles],
        ),
      );
    }

    await this.initOnBehalfOf(req, response.oid);

    return response;
  }

  private async initOnBehalfOf(
    req: Request,
    localAccountId: string,
  ): Promise<void> {
    this.cls.set('localAccountId', localAccountId);

    const account = await this.confidentialClientApplication
      .getTokenCache()
      .getAccountByLocalId(localAccountId);

    if (account !== null) {
      return;
    }

    const access_token = req.headers['authorization'].split(' ')[1];
    console.log(access_token);
    const oboRequest: OnBehalfOfRequest = {
      oboAssertion: access_token,
      scopes: ['openid'],
      authority: environment.azureAd.authority,
    } as OnBehalfOfRequest;
    await this.confidentialClientApplication.acquireTokenOnBehalfOf(oboRequest);
  }
}
