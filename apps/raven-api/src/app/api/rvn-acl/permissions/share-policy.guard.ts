import { Request } from 'express';

import { AzureAdPayload } from '@app/rvns-auth';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../rvn-users/entities/user.entity';
import { AbilityFactory, ShareAbility } from '../casl/ability.factory';
import { CHECK_SHARE_KEY } from './share-policy.decorator';
import {
  PolicyRequestContext,
  SharePolicyHandler,
} from './share-policy.handler';

@Injectable()
export class SharePolicyGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly abilityFactory: AbilityFactory,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<SharePolicyHandler[]>(
        CHECK_SHARE_KEY,
        ctx.getHandler(),
      ) || [];

    if (policyHandlers.length > 0) {
      const request: Request = ctx.switchToHttp().getRequest();
      const requestContext: PolicyRequestContext = {
        params: request.params,
        query: request.query,
        body: request.body,
      };
      const jwt = request.user as AzureAdPayload;
      const user = await this.userRepository.findOne({
        where: {
          azureId: jwt.oid,
        },
      });
      const ability = await this.abilityFactory.createForUser(user);

      return policyHandlers.every((handler) =>
        this.execPolicyHandler(handler, ability, requestContext),
      );
    }
    // allow if no policies found
    return true;
  }

  protected execPolicyHandler(
    handler: SharePolicyHandler,
    ability: ShareAbility,
    context: PolicyRequestContext,
  ): boolean {
    if (typeof handler === 'function') {
      return handler(ability, context);
    }
    return handler.handle(ability, context);
  }
}
