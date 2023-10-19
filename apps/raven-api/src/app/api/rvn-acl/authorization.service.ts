import { UserData } from '@app/rvns-api';

import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtPayload } from '../rvn-auth/contracts/jwt-payload.interface';
import { AbilityFactory } from './casl/ability.factory';
import { ShareAction } from './enums/share-action.enum';

@Injectable()
export class AuthorizationService {
  public constructor(private readonly abilityFactory: AbilityFactory) {}

  public async authorize(
    user: UserData | JwtPayload,
    action: ShareAction,
    resourceId: string,
  ): Promise<void> {
    const ability = await this.abilityFactory.createForUser(user);
    const authorized = ability.can(
      action,
      resourceId.charAt(0),
      resourceId.substring(2),
    );

    if (!authorized) {
      throw new ForbiddenException("You don't have sufficient permissions");
    }
  }
}
