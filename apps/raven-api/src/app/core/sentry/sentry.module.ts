import { Module } from '@nestjs/common';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { environment } from '../../../environments/environment';
import { SentryInterceptor } from './sentry.interceptor';
import { SentryService } from './sentry.service';

// based on https://github.com/ericjeker/nestjs-sentry-example
@Module({
  providers: [SentryService],
})
export class SentryModule {
  public static forRoot(options: Sentry.NodeOptions): DynamicModule {
    !environment.app.sentryDsn || Sentry.init(options);
    return {
      module: SentryModule,
      providers: environment.app.sentryDsn
        ? [
            {
              provide: APP_INTERCEPTOR,
              useClass: SentryInterceptor,
            },
            SentryService,
          ]
        : [],
    };
  }
}
