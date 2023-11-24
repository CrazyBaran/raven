import * as _ from 'lodash';

import { UserData } from '@app/rvns-api';

import {
  AbilityBuilder,
  AbilityClass,
  FieldMatcher,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../../rvn-auth/contracts/jwt-payload.interface';
import { AclService } from '../acl.service';
import { Share } from '../contracts/share.interface';
import { ShareAction } from '../enums/share-action.enum';
import { ShareRolePermissions } from '../permissions/share-role.permission';
import { AbilityCache } from './ability.cache';

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

      const ability = build({ fieldMatcher });
      await this.cache.set(user.id, ability.rules);
      return ability;
    }

    //todo: fix this
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new PureAbility(rules as any, { fieldMatcher }) as any;
  }

  protected async lookupExtraShares(
    user: UserData | JwtPayload,
    shares: Share[],
  ): Promise<Share[]> {
    const extraShares = [...shares];

    return _.uniqWith(
      extraShares,
      (a, b) =>
        a.resourceId === b.resourceId && a.resourceCode === b.resourceCode,
    );
  }
}
