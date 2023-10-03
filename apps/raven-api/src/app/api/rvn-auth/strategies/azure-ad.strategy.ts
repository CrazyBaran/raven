import { BearerStrategy } from 'passport-azure-ad';

import { environment } from '../../../../environments/environment';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AzureAdPayload, UserRegisterEvent } from '@app/rvns-auth';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AzureADStrategy extends PassportStrategy(
  BearerStrategy,
  'AzureAD',
) {
  public constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    protected readonly eventEmitter: EventEmitter2,
  ) {
    super({
      identityMetadata: environment.azureAd.identityMetadata,
      clientID: environment.azureAd.clientId,
      passReqToCallback: false,
      issuer: [environment.azureAd.issuer],
      audience: [environment.azureAd.audience],
      loggingLevel: 'info',
    });
  }

  public async validate(response: AzureAdPayload): Promise<AzureAdPayload> {
    const userRegistered = await this.cacheManager.get<boolean>(
      `user:${response[environment.azureAd.tokenKeys.azureId]}`,
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
    return response;
  }
}
