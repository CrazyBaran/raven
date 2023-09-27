import { Request as ExpressRequest } from 'express';
import { CookieOptions } from 'express-serve-static-core';
import { DateTime } from 'luxon';
import { EntityManager } from 'typeorm';

import { AuthModeEnum, LoginResponseData, UserData } from '@app/rvns-api';

import { environment } from '../../../environments/environment';
import { UsersSessionsService } from '../rvn-users-sessions/users-sessions.service';
import { UserEntity } from '../rvn-users/entities/user.entity';
import {
  CACHE_USER_ORM_PROFILE,
  UsersService,
} from '../rvn-users/users.service';
import { JwtPayload } from './contracts/jwt-payload.interface';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

interface UserJwtData extends LoginResponseData {
  readonly refreshToken: string;
}

interface GetUserJwtOptions {
  readonly user: UserData;
  readonly req: ExpressRequest;
  readonly refresh?: boolean;
}

export const JWT_REFRESH_COOKIE_NAME = 'rvn_refresh';

@Injectable()
export class AuthService {
  public constructor(
    private readonly entityManager: EntityManager,
    private readonly usersService: UsersService,
    private readonly sessionsService: UsersSessionsService,
    private readonly jwtService: JwtService,
  ) {}

  public async getUserJwt(
    authMode: AuthModeEnum,
    options: GetUserJwtOptions,
  ): Promise<UserJwtData> {
    const payload: JwtPayload = await this.getJwtPayloadFromUser(
      options.refresh
        ? await this.usersService.getByEmail(options.user.email)
        : options.user,
      authMode,
    );
    const profile = {
      ...payload,
    };
    let refreshToken = undefined;
    const jwtOptions: JwtSignOptions = {};
    if (options.refresh) {
      // refresh current session
      await this.sessionsService.registerUse(
        options.req,
        options.user,
        options.req.signedCookies[JWT_REFRESH_COOKIE_NAME] || '',
      );
    } else {
      // successfully authenticated
      refreshToken = await this.manageRefreshToken(
        options.req,
        options.user,
        profile,
      );
    }
    return {
      refreshToken,
      accessToken: this.jwtService.sign(profile, jwtOptions),
    };
  }

  public verifyJwt(token: string): JwtPayload {
    return this.jwtService.verify(token);
  }

  public decodeToken(
    token: string,
  ): string | { [key: string]: unknown } | null {
    try {
      return this.jwtService.decode(token);
    } catch (err) {
      return null;
    }
  }

  protected async manageRefreshToken(
    req: ExpressRequest,
    user: UserData,
    profile: JwtPayload,
  ): Promise<string> {
    const session = await this.sessionsService.lookup(req, user, true);
    if (session) {
      return session.refresh;
    }
    const refreshToken = this.jwtService.sign(
      { ...profile, refresh: true },
      { expiresIn: '30d' },
    );
    const decodedToken = this.jwtService.decode(refreshToken);
    await this.sessionsService.register(req, user, {
      refresh: refreshToken,
      refreshExp: decodedToken['exp'],
    });
    return refreshToken;
  }

  protected async getJwtPayloadFromUser(
    user: UserEntity | UserData,
    authMode = AuthModeEnum.Login,
  ): Promise<JwtPayload> {
    return {
      ...(await this.usersService.entityToResponseData(user)),
      authMode,
    };
  }
}
