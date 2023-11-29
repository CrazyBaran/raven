import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { UsersModule } from '../rvn-users/users.module';
import { AclController } from './acl.controller';
import { AclService } from './acl.service';
import { AuthorizationService } from './authorization.service';
import { AbilityCache } from './casl/ability.cache';
import { AbilityFactory } from './casl/ability.factory';
import { ShareTeamEntity } from './entities/share-team.entity';
import { SharePolicyGuard } from './permissions/share-policy.guard';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([ShareTeamEntity, UserEntity]),
    UsersModule,
  ],
  controllers: [AclController],
  providers: [
    AclService,
    AbilityCache,
    AbilityFactory,
    AuthorizationService,
    {
      provide: APP_GUARD,
      useClass: SharePolicyGuard,
    },
  ],
  exports: [AclService, AbilityFactory, AuthorizationService],
})
export class AclModule {}
