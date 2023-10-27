import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT, Environment } from '@app/client/core/environment';

@Injectable()
export class AuthEffects {
  public constructor(
    @Inject(ENVIRONMENT) private readonly environment: Environment,
  ) {}
}
