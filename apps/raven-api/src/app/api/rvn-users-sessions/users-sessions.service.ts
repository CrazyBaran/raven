import { Request as ExpressRequest } from 'express';
import { DateTime } from 'luxon';
import * as requestIp from 'request-ip';
import { MoreThan, Repository } from 'typeorm';

import { CryptoHelper } from '@app/rvnb-crypto';
import { UserData } from '@app/rvns-api';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { UserSessionEntity } from './entities/user-session.entity';

interface RegisterOptions {
  readonly refresh: string;
  readonly refreshExp: number;
}

@Injectable()
export class UsersSessionsService {
  public constructor(
    @InjectRepository(UserSessionEntity)
    private readonly sessionsRepository: Repository<UserSessionEntity>,
    private readonly cryptoHelper: CryptoHelper,
  ) {}

  public async lookup(
    req: ExpressRequest,
    user: UserData,
    decrypt = false,
  ): Promise<UserSessionEntity | null> {
    const session = await this.sessionsRepository.findOneBy({
      userId: user.id,
      ip: requestIp.getClientIp(req),
      agent: req.headers['user-agent'],
      invalidated: false,
      expiresAt: MoreThan(DateTime.now().toJSDate()),
    });
    if (session && decrypt) {
      session.refresh = await this.cryptoHelper.decrypt(session.refresh);
    }
    return session;
  }

  public async register(
    req: ExpressRequest,
    user: UserData,
    options: RegisterOptions,
  ): Promise<UserSessionEntity | null> {
    const session = new UserSessionEntity();
    session.user = { id: user.id } as UserEntity;
    session.ip = requestIp.getClientIp(req) || '';
    session.agent = req.headers['user-agent'] || '';
    session.refresh = await this.cryptoHelper.encrypt(options.refresh);
    session.lastUseIp = session.ip;
    session.lastUseAgent = session.agent;
    session.lastUseDate = new Date();
    session.expiresAt = DateTime.fromSeconds(options.refreshExp).toJSDate();
    return await this.sessionsRepository.save(session);
  }

  public async registerUse(
    req: ExpressRequest,
    user: UserData,
    refresh: string,
  ): Promise<void> {
    await this.sessionsRepository.update(
      { userId: user.id, refresh: await this.cryptoHelper.encrypt(refresh) },
      {
        lastUseDate: new Date(),
        lastUseIp: requestIp.getClientIp(req) || '',
        lastUseAgent: req.headers['user-agent'] || '',
      },
    );
  }

  public async getByRefresh(
    refresh: string,
  ): Promise<UserSessionEntity | null> {
    return this.sessionsRepository.findOneBy({
      refresh: await this.cryptoHelper.encrypt(refresh),
    });
  }

  public async invalidateAllSessions(user: UserEntity): Promise<void> {
    await this.sessionsRepository.update(
      { userId: user.id },
      { invalidated: true },
    );
  }

  public async forget(user: UserData, refresh: string): Promise<void> {
    await this.sessionsRepository.delete({
      userId: user.id,
      refresh: await this.cryptoHelper.encrypt(refresh),
    });
  }
}
