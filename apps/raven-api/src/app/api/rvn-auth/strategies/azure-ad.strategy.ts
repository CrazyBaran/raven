import { BearerStrategy } from 'passport-azure-ad';

import { environment } from '../../../../environments/environment';
import { AzureAdPayload } from '../contracts/azure-ad-payload.interface';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class AzureADStrategy extends PassportStrategy(
  BearerStrategy,
  'AzureAD',
) {
  public constructor() {
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
    return response;
  }
}
