import { CryptoModule } from '@app/rvnb-crypto';
import { RolesNestModule } from '@app/rvns-roles-api';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '../../../environments/environment';
import { TeamsModule } from '../rvn-teams/teams.module';
import { UserEntity } from './entities/user.entity';
import { RegisterUserEventHandler } from './event-handlers/register-user.event-handler';
import { UsersCacheService } from './users-cache.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersServiceLogger } from './users.service.logger';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CryptoModule.register({
      key: environment.security.crypto.key,
      initVector: environment.security.crypto.initVector,
    }),
    TeamsModule,
    RolesNestModule,
  ],
  providers: [
    UsersService,
    UsersServiceLogger,
    UsersCacheService,
    RegisterUserEventHandler,
  ],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
