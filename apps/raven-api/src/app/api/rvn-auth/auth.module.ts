import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import { PeopleTagEntity } from '../rvn-tags/entities/tag.entity';
import { UsersCacheService } from '../rvn-users/users-cache.service';
import { UsersModule } from '../rvn-users/users.module';
import { AuthService } from './auth.service';
import { AzureAdGuard } from './guards/azure-ad.guard';
import { AzureADStrategy } from './strategies/azure-ad.strategy';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule,
    UsersModule,
    TypeOrmModule.forFeature([PeopleTagEntity]),
    ClsModule.forFeature(),
  ],
  providers: [
    AuthService,
    AzureADStrategy,
    {
      provide: APP_GUARD,
      useClass: AzureAdGuard,
    },
    UsersCacheService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
