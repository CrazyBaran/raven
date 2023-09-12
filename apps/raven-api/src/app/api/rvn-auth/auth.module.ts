import { CryptoModule } from '@app/rvnb-crypto';

import { environment } from '../../../environments/environment';
import { UsersSessionsModule } from '../rvn-users-sessions/users-sessions.module';
import { UsersModule } from '../rvn-users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
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
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
