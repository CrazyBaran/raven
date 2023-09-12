import { AuthorizationService } from '../../rvn-acl/authorization.service';
import { ShareAction } from '../../rvn-acl/enums/share-action.enum';
import { AuthService } from '../auth.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class WsJoinResourceGuard implements CanActivate {
  public constructor(
    private readonly authenticationService: AuthService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const resourceId = context.switchToWs().getData();
    try {
      const user = this.authenticationService.verifyJwt(
        client.handshake.query['auth'],
      );
      await this.authorizationService.authorize(
        user,
        ShareAction.View,
        `${resourceId}`,
      );
    } catch (err) {
      return false;
    }
    return true;
  }
}
