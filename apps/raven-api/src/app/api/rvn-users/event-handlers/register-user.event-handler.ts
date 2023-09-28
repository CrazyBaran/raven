import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserRegisterEvent } from '@app/rvns-auth';
import { UsersService } from '../users.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RegisterUserEventHandler {
  public constructor(
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @OnEvent('user-register')
  protected async process(event: UserRegisterEvent): Promise<void> {
    await this.usersService.create(event.email, {
      azureId: event.azureId,
      name: event.name,
      team: null,
    });
    await this.cacheManager.set(`user:${event.azureId}`, true);
  }
}
