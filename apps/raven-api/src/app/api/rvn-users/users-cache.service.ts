import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UsersService } from './users.service';

@Injectable()
export class UsersCacheService implements OnModuleInit {
  public constructor(
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  public async onModuleInit(): Promise<void> {
    const users = await this.usersService.list({});
    await this.cacheManager.reset();
    await Promise.all(
      users.map((user) => this.cacheManager.set(`user:${user.azureId}`, true)),
    );
  }
}
