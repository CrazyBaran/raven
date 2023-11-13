import { RolesNestModule } from '@app/rvns-roles-api';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleTagEntity } from '../rvn-tags/entities/tag.entity';
import { TeamsModule } from '../rvn-teams/teams.module';
import { UserEntity } from './entities/user.entity';
import { RegisterUserEventHandler } from './event-handlers/register-user.event-handler';
import { UsersCacheService } from './users-cache.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersServiceLogger } from './users.service.logger';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PeopleTagEntity]),
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
