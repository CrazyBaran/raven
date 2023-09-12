import * as _ from 'lodash';

import { UserData } from '@app/rvns-api';
import { RoleEnum } from '@app/rvns-roles';

import { JwtPayload } from '../../rvn-auth/contracts/jwt-payload.interface';
import { AclService } from '../acl.service';
import { Share } from '../contracts/share.interface';
import { ShareAction } from '../enums/share-action.enum';
import { ShareRolePermissions } from '../permissions/share-role.permission';
import { AbilityCache } from './ability.cache';
import {
  PureAbility,
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
  FieldMatcher,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

export type ShareAbility = PureAbility<[ShareAction, ShareSubjects]>;
type ShareSubjects = InferSubjects<string>;

const fieldMatcher: FieldMatcher = (fields) => (field) =>
  fields.includes(field);

@Injectable()
export class AbilityFactory {
  public constructor(
    private readonly aclService: AclService,
    private readonly cache: AbilityCache,
  ) {}

  public async createForUser(
    user: UserData | JwtPayload,
  ): Promise<ShareAbility> {
    const rules = await this.cache.get(user.id);
    if (!rules) {
      const { can, build } = new AbilityBuilder<
        PureAbility<[ShareAction, ShareSubjects]>
      >(PureAbility as AbilityClass<ShareAbility>);

      if (user.roles.includes(RoleEnum.SuperAdmin)) {
        // super admin have full access to the teams
        for (const perm of [
          ShareAction.Create,
          ShareAction.View,
          ShareAction.Share,
          ShareAction.Edit,
          ShareAction.Delete,
        ]) {
          can(perm, 't');
        }
      } else {
        // build acl rules from shares
        const shares = await this.lookupExtraShares(
          user,
          await this.aclService.getByActor(user.id),
        );
        for (const share of shares) {
          const resType = share.resourceCode;
          const resId = share.resourceId;
          for (const perm of ShareRolePermissions[resType][share.role]) {
            can(perm, resType, resId);
          }
        }
      }

      const ability = build({ fieldMatcher });
      await this.cache.set(user.id, ability.rules);
      return ability;
    }
    return new PureAbility(rules, { fieldMatcher });
  }

  protected async lookupExtraShares(
    user: UserData | JwtPayload,
    shares: Share[],
  ): Promise<Share[]> {
    const extraShares = [...shares];
    if (user.roles.includes(RoleEnum.TeamAdmin)) {
      // enable access to the team
    }

    return _.uniqWith(
      extraShares,
      (a, b) =>
        a.resourceId === b.resourceId && a.resourceCode === b.resourceCode,
    );
  }
}
