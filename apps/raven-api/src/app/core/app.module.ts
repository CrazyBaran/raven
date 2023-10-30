import { redisInsStore } from 'cache-manager-ioredis-yet';
import Redis from 'ioredis';

import { PlatformModule } from '@app/rvnb-platform';

import { CacheModule } from '@nestjs/cache-manager';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Sentry from '@sentry/node';
import { BullModule } from '@taskforcesh/nestjs-bullmq-pro';
import { ClsModule } from 'nestjs-cls';
import { environment } from '../../environments/environment';
import { AclModule } from '../api/rvn-acl/acl.module';
import { AffinityIntegrationModule } from '../api/rvn-affinity-integration/affinity-integration.module';
import { AuditLogsMiddleware } from '../api/rvn-audit-logs/audit-logs.middleware';
import { AuditLogsModule } from '../api/rvn-audit-logs/audit-logs.module';
import { AuthModule } from '../api/rvn-auth/auth.module';
import { CommModule } from '../api/rvn-comm/comm.module';
import { NotesModule } from '../api/rvn-notes/notes.module';
import { OnBehalfOfModule } from '../api/rvn-on-behalf-of/on-behalf-of.module';
import { OpportunitiesModule } from '../api/rvn-opportunities/opportunities.module';
import { PipelineModule } from '../api/rvn-pipeline/pipeline.module';
import { StorageAccountModule } from '../api/rvn-storage-account/storage-account.module';
import { TagsModule } from '../api/rvn-tags/tags.module';
import { TeamsModule } from '../api/rvn-teams/teams.module';
import { TemplatesModule } from '../api/rvn-templates/templates.module';
import { UsersSessionsModule } from '../api/rvn-users-sessions/users-sessions.module';
import { UsersModule } from '../api/rvn-users/users.module';
import { WebSocketsModule } from '../api/rvn-web-sockets/web-sockets.module';
import { BullService } from './bull.service';
import { HttpCacheInterceptor } from './http-cache.interceptor';
import { RequestLoggerMiddleware } from './request-logger.middleware';
import { RequestLogger } from './request.logger';
import { SentryModule } from './sentry/sentry.module';
import { SwaggerService } from './swagger.service';
import { ThrottlerGuard } from './throttler.guard';
import { TransformInterceptor } from './transform.interceptor';

@Module({
  imports: [
    // core
    ThrottlerModule.forRoot({
      ttl: environment.security.rateLimiting.ttl,
      limit: environment.security.rateLimiting.limit,
    }),
    SentryModule.forRoot({
      dsn: environment.app.sentryDsn,
      tracesSampleRate: 1.0,
      environment: environment.app.production ? 'production' : 'development',
    }),
    TypeOrmModule.forRoot(environment.database.orm),
    BullModule.forRoot(environment.bull.config),
    CacheModule.register({
      isGlobal: true,
      store: redisInsStore(new Redis(environment.cache.store.redis.options)),
    }),
    EventEmitterModule.forRoot(),
    PlatformModule.register({
      redisOptions: environment.database.redis.options,
    }),
    ClsModule.forRoot({
      middleware: {
        mount: true,
      },
    }),
    AuditLogsModule,
    // api
    AuthModule,
    AclModule,
    TeamsModule,
    UsersModule,
    UsersSessionsModule,
    CommModule,
    WebSocketsModule,
    OpportunitiesModule,
    AffinityIntegrationModule,
    TemplatesModule,
    NotesModule,
    TagsModule,
    PipelineModule,
    StorageAccountModule,
    OnBehalfOfModule,
  ],
  providers: [
    // core
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
    BullService,
    SwaggerService,
    RequestLogger,
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware, AuditLogsMiddleware).forRoutes('*');
    consumer.apply(Sentry.Handlers.requestHandler()).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
