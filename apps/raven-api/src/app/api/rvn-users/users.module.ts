import { CryptoModule } from '@app/rvnb-crypto';
import { RolesNestModule } from '@app/rvns-roles-api';

import { environment } from '../../../environments/environment';
import { TeamsModule } from '../rvn-teams/teams.module';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersServiceLogger } from './users.service.logger';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    CryptoModule.register({
      key: environment.security.crypto.key,
      initVector: environment.security.crypto.initVector,
    }),
    TeamsModule,
    RolesNestModule,
  ],
  providers: [UsersService, UsersServiceLogger],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
