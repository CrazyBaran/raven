import { Request } from 'express';

import { UserData } from '@app/rvns-api';

import { AbilityFactory, ShareAbility } from '../casl/ability.factory';
import { CHECK_SHARE_KEY } from './share-policy.decorator';
import {
  PolicyRequestContext,
  SharePolicyHandler,
} from './share-policy.handler';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SharePolicyGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly abilityFactory: AbilityFactory
  ) {}

  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<SharePolicyHandler[]>(
        CHECK_SHARE_KEY,
        ctx.getHandler()
      ) || [];

    if (policyHandlers.length > 0) {
      const request: Request = ctx.switchToHttp().getRequest();
      const requestContext: PolicyRequestContext = {
        params: request.params,
        query: request.query,
        body: request.body,
      };
      const user = request.user as UserData;
      const ability = await this.abilityFactory.createForUser(user);

      return policyHandlers.every((handler) =>
        this.execPolicyHandler(handler, ability, requestContext)
      );
    }
    // allow if no policies found
    return true;
  }

  protected execPolicyHandler(
    handler: SharePolicyHandler,
    ability: ShareAbility,
    context: PolicyRequestContext
  ): boolean {
    if (typeof handler === 'function') {
      return handler(ability, context);
    }
    return handler.handle(ability, context);
  }
}
