import { BearerStrategy } from 'passport-azure-ad';

import { AzureAdPayload, UserRegisterEvent } from '@app/rvns-auth';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PassportStrategy } from '@nestjs/passport';
import * as oTel from '@opentelemetry/api';
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

    this.cls.set('localAccountId', response.oid);
    this.cls.set('accessToken', req.headers['authorization'].split(' ')[1]);

    const activeSpan = oTel.trace.getActiveSpan();
    activeSpan.addEvent('user-logged-in');
    activeSpan.setAttribute(
      'rvn.user.name',
      response[environment.azureAd.tokenKeys.name],
    );
    activeSpan.setAttribute(
      'rvn.user.email',
      response[environment.azureAd.tokenKeys.email],
    );

    return response;
  }
}
