import { UserRegisterEvent } from '@app/rvns-auth';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UsersCacheService } from '../users-cache.service';
import { UsersService } from '../users.service';

@Injectable()
export class RegisterUserEventHandler {
  public constructor(
    private readonly usersService: UsersService,
    private readonly usersCacheService: UsersCacheService,
  ) {}

  @OnEvent('user-register')
  protected async process(event: UserRegisterEvent): Promise<void> {
    let user = await this.usersService.getByEmail(event.email);
    if (user === null) {
      user = await this.usersService.create(event.email, {
        azureId: event.azureId,
        name: event.name,
        team: null,
      });
    }

    await this.usersCacheService.addOrReplace(user);
  }
}
