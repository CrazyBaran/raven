import { CryptoModule } from '@app/rvnb-crypto';

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { environment } from '../../../environments/environment';
import { UsersSessionsModule } from '../rvn-users-sessions/users-sessions.module';
import { UsersCacheService } from '../rvn-users/users-cache.service';
import { UsersModule } from '../rvn-users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AzureAdGuard } from './guards/azure-ad.guard';
import { AzureADStrategy } from './strategies/azure-ad.strategy';

@Module({
  imports: [
    JwtModule.register(environment.security.jwt),
    CryptoModule.register({
      key: environment.security.crypto.key,
      initVector: environment.security.crypto.initVector,
    }),
    PassportModule,
    UsersModule,
    UsersSessionsModule,
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
  controllers: [AuthController],
})
export class AuthModule {}
