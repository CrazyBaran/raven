import { ExtractJwt, Strategy } from 'passport-jwt';
import { EntityManager } from 'typeorm';

import { environment } from '../../../../environments/environment';
import { UserEntity } from '../../rvn-users/entities/user.entity';
import { CACHE_USER_ORM_PROFILE } from '../../rvn-users/users.service';
import { JwtPayload } from '../contracts/jwt-payload.interface';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  public constructor(private readonly entityManager: EntityManager) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environment.security.jwt.secret,
    });
  }

  public async validate(payload: JwtPayload): Promise<JwtPayload | undefined> {
    if (
      await this.entityManager.findOne(UserEntity, {
        where: {
          id: payload.id,
          activated: true,
          suspended: false,
          sessionInvalidated: false,
        },
        cache: {
          id: `${CACHE_USER_ORM_PROFILE}${payload.id}`,
          milliseconds: 600000,
        },
      })
    ) {
      return payload;
    }
  }
}
